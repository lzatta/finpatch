import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export type TxType = "income" | "expense";

export type Transaction = {
  id: string;
  user_id: string;
  type: TxType;
  category: string;
  date: string; // ISO
  description?: string;
  note?: string | null;     // <- API do app
  amount: number;           // <- API do app
  created_at: string;
  updated_at: string;
  synced?: boolean;
};

type State = {
  items: Transaction[];
  loading: boolean;
  error: string | null;

  fetchAll: (userId: string) => Promise<void>;
  add: (tx: Omit<Transaction, "id" | "created_at" | "updated_at" | "synced" | "user_id"> & { user_id?: string }) => Promise<Transaction>;
  update: (id: string, patch: Partial<Transaction>) => Promise<void>;
  remove: (id: string) => Promise<void>;

  incomeTotal: () => number;
  expenseTotal: () => number;

  // ALIASES (compat)
  addTransaction: State["add"];
  updateTransaction: State["update"];
  deleteTransaction: State["remove"];
  createTransaction: State["add"];
  create: State["add"];
};

function nowISO() { return new Date().toISOString(); }
function rid() { return (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)); }

export const useTransactionsStore = create<State>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  async fetchAll(userId: string) {
    if (!userId) { set({ items: [], loading: false, error: null }); return; }
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("transactions")
        // leia value/account do banco
        .select("id,user_id,type,category,date,description,account,value,created_at,updated_at")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) throw error;

      const mapped: Transaction[] = (data ?? []).map((r: any) => ({
        id: r.id,
        user_id: r.user_id,
        type: r.type as TxType,
        category: r.category ?? "",
        date: r.date ? new Date(r.date).toISOString() : nowISO(),
        description: r.description ?? "",
        note: r.account ?? null,                    // <- mapeia account -> note
        amount: Number(r.value ?? 0),               // <- mapeia value   -> amount
        created_at: r.created_at ? new Date(r.created_at).toISOString() : nowISO(),
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : nowISO(),
        synced: true,
      }));
      set({ items: mapped, loading: false, error: null });
    } catch (e: any) {
      console.error("fetchAll error:", e);
      set({ loading: false, error: e?.message ?? "Erro ao buscar transações" });
    }
  },

  async add(input) {
    const userId = input.user_id ?? undefined; // deixa nulo/undefined para trigger/default preencher
    const tx: Transaction = {
      id: rid(),
      user_id: userId,
      type: input.type,
      category: input.category ?? "",
      date: input.date ?? nowISO(),
      description: input.description ?? "",
      note: input.note ?? null,                   // API do app
      amount: Number(input.amount ?? 0),          // API do app
      created_at: nowISO(),
      updated_at: nowISO(),
      synced: false,
    };

    // otimista
    set({ items: [tx, ...get().items] });

    try {
      const { data, error } = await supabase
        .from("transactions")
        // envie nomes de coluna do BANCO:
        .insert({
          id: tx.id,
          user_id: tx.user_id,                    // o trigger preenche se vier null
          type: tx.type,
          category: tx.category,
          date: tx.date,
          description: tx.description,
          account: tx.note,                       // note -> account
          value: tx.amount,                       // amount -> value
        })
        .select("created_at,updated_at")
        .single();

      if (error) throw error;

      set({
        items: get().items.map((it) =>
          it.id === tx.id
            ? {
                ...it,
                created_at: data?.created_at ? new Date(data.created_at).toISOString() : it.created_at,
                updated_at: data?.updated_at ? new Date(data.updated_at).toISOString() : nowISO(),
                synced: true,
              }
            : it
        ),
      });

      return get().items.find((i) => i.id === tx.id)!;
    } catch (e: any) {
      console.error("add error:", e);
      set({ error: e?.message ?? "Erro ao salvar transação" });
      return tx; // mantém a otimista (você pode reverter se quiser)
    }
  },

  async update(id, patch) {
    const prev = get().items;
    const idx = prev.findIndex((t) => t.id === id);
    if (idx < 0) return;

    const nextItem = { ...prev[idx], ...patch, updated_at: nowISO(), synced: false } as Transaction;
    set({ items: prev.toSpliced(idx, 1, nextItem) });

    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          type: nextItem.type,
          category: nextItem.category,
          date: nextItem.date,
          description: nextItem.description,
          account: nextItem.note,       // note -> account
          value: nextItem.amount,       // amount -> value
        })
        .eq("id", id);

      if (error) throw error;

      set({
        items: get().items.map((it) => (it.id === id ? { ...it, synced: true } : it)),
      });
    } catch (e: any) {
      console.error("update error:", e);
      set({ error: e?.message ?? "Erro ao atualizar transação" });
    }
  },

  async remove(id) {
    const prev = get().items;
    set({ items: prev.filter((t) => t.id !== id) });

    try {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    } catch (e: any) {
      console.error("remove error:", e);
      set({ error: e?.message ?? "Erro ao excluir transação" });
      set({ items: prev });
    }
  },

  incomeTotal() {
    const list = get().items ?? [];
    return list.filter((t) => t.type === "income").reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  },

  expenseTotal() {
    const list = get().items ?? [];
    return list.filter((t) => t.type === "expense").reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  },

  // ALIASES
  addTransaction(input) { return get().add(input); },
  updateTransaction(id, patch) { return get().update(id, patch); },
  deleteTransaction(id) { return get().remove(id); },
  create(input) { return get().add(input); },
  createTransaction(input) { return get().add(input); },
}));
