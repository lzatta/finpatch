import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export type Goal = {
  id: string;
  user_id: string;
  name: string;
  target: number;
  current: number;
  due_date?: string | null;
  created_at?: string;
  updated_at?: string;
};

type GoalsState = {
  goals: Goal[];
  loading: boolean;
  error: string | null;

  // API “nova”
  fetch: (userId: string) => Promise<void>;
  create: (
    userId: string,
    input: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at" | "current"> & { current?: number }
  ) => Promise<Goal | null>;
  update: (id: string, patch: Partial<Goal>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reset: () => void;

  // ALIASES (compatibilidade c/ código antigo — NÃO REMOVER)
  add: GoalsState["create"];
  addGoal: GoalsState["create"];
  updateGoal: GoalsState["update"];
  delete: GoalsState["remove"];
  removeGoal: GoalsState["remove"];
  addContribution: (goalId: string, value: number) => Promise<void>;
};

export const useGoalsStore = create<GoalsState>()((set, get) => ({
  goals: [],
  loading: false,
  error: null,

  async fetch(userId: string) {
    if (!userId) {
      set({ goals: [], loading: false, error: null });
      return;
    }
    set({ loading: true, error: null });

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      set({ error: error.message, loading: false, goals: [] });
      return;
    }
    set({ goals: Array.isArray(data) ? (data as Goal[]).map(g => ({...g, target: g.target_value, current: g.current_value})) : [], loading: false });
  },

  async create(userId, input) {
    if (!userId) return null;

    const payload = { 
        name: input.name,
        target_value: input.target,
        current_value: input.current ?? 0,
        monthly_contribution: (input as any).monthly_contribution,
        deadline: (input as any).due_date,
        user_id: userId 
    };
    const { data, error } = await supabase
      .from("goals")
      .insert(payload)
      .select("*")
      .single();

    if (error || !data) return null;
    
    const newGoal = { ...data, target: data.target_value, current: data.current_value } as Goal

    set({ goals: [newGoal, ...get().goals] });
    return newGoal;
  },

  async update(id, patch) {
    const { data, error } = await supabase
      .from("goals")
      .update({
          name: patch.name,
          target_value: patch.target,
          current_value: patch.current,
          deadline: patch.due_date,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) return;

    const list = get().goals;
    const idx = list.findIndex((g) => g.id === id);
    const updatedGoal = { ...data, target: data.target_value, current: data.current_value } as Goal
    if (idx !== -1) {
      const next = list.slice();
      next[idx] = updatedGoal;
      set({ goals: next });
    } else {
      set({ goals: [updatedGoal, ...list] });
    }
  },

  async remove(id) {
    await supabase.from("goals").delete().eq("id", id);
    set({ goals: get().goals.filter((g) => g.id !== id) });
  },

  reset() {
    set({ goals: [], loading: false, error: null });
  },

  async addContribution(goalId, value) {
    const goal = get().goals.find(g=>g.id===goalId);
    if (!goal) return;
    const invested = goal.current + value;
    await get().update(goalId, { current: invested });
  },

  // ===== ALIASES (compat) =====
  add(userId, input) {
    return get().create(userId, input);
  },
  addGoal(userId, input) {
    return get().create(userId, input);
  },
  updateGoal(id, patch) {
    return get().update(id, patch);
  },
  delete(id) {
    return get().remove(id);
  },
  removeGoal(id) {
    return get().remove(id);
  },
}));

// Selector SEGURO — sempre devolve array
export const selectGoalsArray = (s: GoalsState) =>
  Array.isArray(s.goals) ? s.goals : [];
