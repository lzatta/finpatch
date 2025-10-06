import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Member = { id: string; name: string; avatar?: string };

export type FamilyGoalStatus = "active" | "completed" | "expired";

export type FamilyGoal = {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
  dueDate?: string;
  status: FamilyGoalStatus;
  contributions: Record<string /*memberId*/, number>;
};

export type FamilyCosmeticType = "familyAvatar" | "familyFrame" | "familyBackground" | "familyEffect";
export type FamilyRarity = "comum" | "raro" | "épico" | "lendário" | "oculto";

export type FamilyCosmetic = {
  id: string;
  name: string;
  type: FamilyCosmeticType;
  rarity: FamilyRarity;
};

export const FAMILY_COSMETICS_CATALOG: FamilyCosmetic[] = [
  { id: "fam-avatar-classic", name: "Avatar Clássico", type: "familyAvatar", rarity: "comum" },
  { id: "fam-avatar-heroes",  name: "Equipe Heróis",  type: "familyAvatar", rarity: "raro" },
  { id: "fam-frame-gold",     name: "Moldura Ouro",   type: "familyFrame",  rarity: "épico" },
  { id: "fam-bg-galaxy",      name: "Galáxia",        type: "familyBackground", rarity: "lendário" },
  { id: "fam-fx-fireworks",   name: "Fogos",          type: "familyEffect", rarity: "lendário" },
];

export type FamilyBadge = {
  id: string;
  title: string;
  description: string;
  rarity: FamilyRarity;
  reward?: string; // cosmetic id
};

export const FAMILY_BADGES_CATALOG: FamilyBadge[] = [
  { id: "first-shared-goal", title: "Primeira Meta Coletiva", description: "Família concluiu a primeira meta em conjunto.", rarity: "comum", reward: "fam-frame-gold" },
  { id: "all-contributed",   title: "Todos Participaram", description: "Todos os membros contribuíram na mesma meta.", rarity: "raro", reward: "fam-avatar-heroes" },
  { id: "fast-finish",       title: "Velocistas", description: "Meta concluída 20% antes do prazo.", rarity: "épico", reward: "fam-bg-galaxy" },
];

type LevelInfo = { level: number; currentInLevel: number; nextLevelNeed: number; progressPct: number };

function levelFromXp(totalXp: number): LevelInfo {
  let xpLeft = Math.max(0, Math.floor(totalXp));
  let need = 100;
  let level = 1;
  const growth = 1.25;
  while (xpLeft >= need) { xpLeft -= need; level += 1; need = Math.round(need * growth) }
  const progressPct = need > 0 ? Math.min(100, Math.round((xpLeft / need) * 100)) : 0;
  return { level, currentInLevel: xpLeft, nextLevelNeed: need, progressPct };
}

function xpForFamilyGoal(g: FamilyGoal): number {
  const magnitude = Math.min(5, Math.ceil(g.targetAmount / 2000));
  const base = 120 * magnitude;
  let bonus = 0;
  if (g.dueDate) {
    const now = Date.now();
    const due = new Date(g.dueDate).getTime();
    if (now < due) bonus = Math.round(base * 0.2);
  }
  return base + bonus;
}

type CelebrationItem =
  | { kind: "family-level"; from: number; to: number }
  | { kind: "family-badge"; badgeId: string }
  | { kind: "family-goal"; goalId: string; xp: number };

type FamilyState = {
  id: string | null;
  name: string | null;
  members: Member[];
  xp: number;
  level: number;
  addXP: (delta: number) => void;
  getLevelInfo: () => LevelInfo;
  inventory: Record<FamilyCosmeticType, string[]>;
  equipped: Record<FamilyCosmeticType, string | null>;
  grantCosmetic: (id: string) => void;
  equip: (type: FamilyCosmeticType, id: string) => void;
  badgesUnlocked: Record<string, boolean>;
  grantBadge: (id: string) => void;
  goals: FamilyGoal[];
  addGoal: (goal: Omit<FamilyGoal, "id" | "createdAt" | "status" | "currentAmount" | "contributions">) => string;
  contribute: (goalId: string, memberId: string, amount: number) => void;
  celebrations: CelebrationItem[];
  enqueue: (c: CelebrationItem) => void;
  dequeue: () => void;
  ensureFamily: (name?: string) => void;
};

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set, get) => ({
      id: null,
      name: null,
      members: [],
      xp: 0,
      level: 1,
      inventory: { familyAvatar: ["fam-avatar-classic"], familyFrame: [], familyBackground: [], familyEffect: [] },
      equipped: { familyAvatar: "fam-avatar-classic", familyFrame: null, familyBackground: null, familyEffect: null },
      badgesUnlocked: {},
      goals: [],
      celebrations: [],

      ensureFamily: (name = "Família Silva") => {
        if (!get().id) {
          set({ id: crypto.randomUUID(), name, members: [{ id: "user-1", name: "Você" }] });
        }
      },

      addXP: (delta) => {
        const add = Math.max(0, Math.floor(delta || 0));
        if (add <= 0) return;
        const before = get().level;
        const total = get().xp + add;
        const info = levelFromXp(total);
        set({ xp: total, level: info.level });
        if (info.level > before) {
          get().enqueue({ kind: "family-level", from: before, to: info.level });
        }
      },
      getLevelInfo: () => levelFromXp(get().xp),

      grantCosmetic: (id) => {
        const c = FAMILY_COSMETICS_CATALOG.find(x => x.id === id);
        if (!c) return;
        const inv = { ...get().inventory };
        if (!inv[c.type].includes(id)) {
          inv[c.type] = [...inv[c.type], id];
          set({ inventory: inv });
          if (!get().equipped[c.type]) {
            get().equip(c.type, id);
          }
        }
      },
      equip: (type, id) => {
        const inv = get().inventory[type];
        if (!inv.includes(id)) return;
        set({ equipped: { ...get().equipped, [type]: id } });
      },

      grantBadge: (id) => {
        if (get().badgesUnlocked[id]) return;
        const b = FAMILY_BADGES_CATALOG.find(x => x.id === id);
        set({ badgesUnlocked: { ...get().badgesUnlocked, [id]: true } });
        if (b?.reward) get().grantCosmetic(b.reward);
        get().enqueue({ kind: "family-badge", badgeId: id });
      },

      addGoal: (g) => {
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();
        const newGoal: FamilyGoal = {
          id,
          title: g.title,
          description: g.description,
          targetAmount: Math.max(0, g.targetAmount),
          currentAmount: 0,
          createdAt,
          dueDate: g.dueDate,
          status: "active",
          contributions: {},
        };
        set({ goals: [newGoal, ...get().goals] });
        return id;
      },

      contribute: (goalId, memberId, amount) => {
        const amt = Math.max(0, amount);
        if (amt <= 0) return;
        const updated = get().goals.map(goal => {
          if (goal.id !== goalId || goal.status !== "active") return goal;
          const current = (goal.contributions[memberId] || 0) + amt;
          const next = {
            ...goal,
            contributions: { ...goal.contributions, [memberId]: current },
            currentAmount: goal.currentAmount + amt,
          };
          if (next.currentAmount >= next.targetAmount && next.status === "active") {
            next.status = "completed";
            const xp = xpForFamilyGoal(next);
            get().addXP(xp);
            get().enqueue({ kind: "family-goal", goalId: next.id, xp });
            if (!get().badgesUnlocked["first-shared-goal"]) get().grantBadge("first-shared-goal");
            const memberIds = get().members.map(m => m.id);
            const allContrib = memberIds.length > 0 && memberIds.every(id => (next.contributions[id] || 0) > 0);
            if (allContrib && !get().badgesUnlocked["all-contributed"]) get().grantBadge("all-contributed");
            if (next.dueDate && Date.now() < new Date(next.dueDate).getTime()) {
              if (!get().badgesUnlocked["fast-finish"]) get().grantBadge("fast-finish");
            }
          }
          return next;
        });
        set({ goals: updated });
      },

      enqueue: (c) => set({ celebrations: [...get().celebrations, c] }),
      dequeue: () => set({ celebrations: get().celebrations.slice(1) }),
    }),
    {
      name: "finpatch/family",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
