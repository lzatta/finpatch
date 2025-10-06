import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

// ---------- Level curve ----------
type LevelInfo = {
  level: number
  currentInLevel: number
  nextLevelNeed: number
  progressPct: number
}
function levelFromXp(totalXp: number): LevelInfo {
  let xpLeft = Math.max(0, Math.floor(totalXp))
  let need = 100
  let level = 1
  const growth = 1.25
  while (xpLeft >= need) {
    xpLeft -= need
    level += 1
    need = Math.round(need * growth)
  }
  const progressPct = need > 0 ? Math.min(100, Math.round((xpLeft / need) * 100)) : 0
  return { level, currentInLevel: xpLeft, nextLevelNeed: need, progressPct }
}

// ---------- NOVO: tipos de cosméticos / badges ----------
export type Rarity = "comum" | "raro" | "épico" | "lendário" | "oculto"
export type CosmeticType = "avatarSkin" | "frame" | "background" | "effect"

export type Cosmetic = {
  id: string
  name: string
  type: CosmeticType
  rarity: Rarity
  preview?: string // url/emoji
}

export type Badge = {
  id: string
  title: string
  description: string
  rarity: Rarity
  reward?: string // cosmetic id (opcional)
}

// ---------- NOVO: catálogo base (pode expandir depois) ----------
export const COSMETICS_CATALOG: Cosmetic[] = [
  { id: "skin-classic",  name: "Clássico",     type: "avatarSkin", rarity: "comum" },
  { id: "skin-neon",     name: "Neon Pulse",   type: "avatarSkin", rarity: "épico" },
  { id: "frame-gold",    name: "Moldura Ouro", type: "frame",      rarity: "raro" },
  { id: "bg-sakura",     name: "Sakura",       type: "background", rarity: "lendário" },
  { id: "fx-stardust",   name: "Stardust",     type: "effect",     rarity: "lendário" },
]

export const BADGES_CATALOG: Badge[] = [
  { id: "first-goal",  title: "Primeira Meta", description: "Crie sua primeira meta.", rarity: "comum", reward: "frame-gold" },
  { id: "frugal-week", title: "Semana sem iFood", description: "7 dias sem delivery.", rarity: "raro", reward: "skin-neon" },
  { id: "hidden-owl",  title: "Coruja Oculta", description: "Conquista secreta.", rarity: "oculto", reward: "bg-sakura" },
]

// ---------- NOVO: mapeamento de recompensas por nível ----------
const LEVEL_REWARDS: Record<number, string[]> = {
  5:  ["frame-gold"],
  10: ["bg-sakura"],
  15: ["fx-stardust"],
}

// ---------- NOVO: fila de celebrações ----------
type CelebrationItem =
  | { kind: "level"; from: number; to: number }
  | { kind: "badge"; badgeId: string }
export type CelebrationsQueue = CelebrationItem[]

// ---------- Store ----------
type ProfileState = {
  // XP & nível
  xp: number
  level: number
  addXP: (delta: number) => void
  getLevelInfo: () => LevelInfo

  // Inventário / equipamentos
  inventory: Record<CosmeticType, string[]>
  equipped: Record<CosmeticType, string | null>
  grantCosmetic: (id: string) => void
  equip: (type: CosmeticType, id: string) => void

  // Badges
  badgesUnlocked: Record<string, boolean>
  grantBadge: (id: string) => void

  // Fila de celebrações
  celebrations: CelebrationsQueue
  enqueue: (c: CelebrationItem) => void
  dequeue: () => void

  // Config
  settings: { sfx: boolean; animations: boolean }
  setSettings: (s: Partial<ProfileState["settings"]>) => void

  reset: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      inventory: { avatarSkin: ["skin-classic"], frame: [], background: [], effect: [] },
      equipped: { avatarSkin: "skin-classic", frame: null, background: null, effect: null },
      badgesUnlocked: {},
      celebrations: [],
      settings: { sfx: true, animations: true },

      getLevelInfo: () => levelFromXp(get().xp),

      enqueue: (c) => set({ celebrations: [...get().celebrations, c] }),
      dequeue: () => set({ celebrations: get().celebrations.slice(1) }),

      grantCosmetic: (id) => {
        const cos = COSMETICS_CATALOG.find(c => c.id === id)
        if (!cos) return
        const inv = { ...get().inventory }
        if (!inv[cos.type].includes(id)) {
          inv[cos.type] = [...inv[cos.type], id]
          set({ inventory: inv })
          // auto-equip se não houver nenhum
          if (!get().equipped[cos.type]) {
            get().equip(cos.type, id)
          }
        }
      },

      equip: (type, id) => {
        const inv = get().inventory[type]
        if (!inv.includes(id)) return
        set({ equipped: { ...get().equipped, [type]: id } })
      },

      grantBadge: (id) => {
        if (get().badgesUnlocked[id]) return
        const badge = BADGES_CATALOG.find(b => b.id === id)
        set({ badgesUnlocked: { ...get().badgesUnlocked, [id]: true } })
        if (badge?.reward) get().grantCosmetic(badge.reward)
        get().enqueue({ kind: "badge", badgeId: id })
      },

      addXP: (delta) => {
        const add = Math.max(0, Math.floor(delta || 0))
        if (add <= 0) return
        const before = get().level
        const total = get().xp + add
        const info = levelFromXp(total)
        set({ xp: total, level: info.level })

        // SE subiu de nível → enfileira celebração e entrega recompensas de nível
        if (info.level > before) {
          get().enqueue({ kind: "level", from: before, to: info.level })
          for (let lv = before + 1; lv <= info.level; lv++) {
            (LEVEL_REWARDS[lv] || []).forEach(get().grantCosmetic)
          }
        }
      },

      setSettings: (s) => set({ settings: { ...get().settings, ...s } }),

      reset: () =>
        set({
          xp: 0,
          level: 1,
          inventory: { avatarSkin: ["skin-classic"], frame: [], background: [], effect: [] },
          equipped: { avatarSkin: "skin-classic", frame: null, background: null, effect: null },
          badgesUnlocked: {},
          celebrations: [],
        }),
    }),
    {
      name: "finpatch/profile",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
