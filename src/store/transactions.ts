// /src/store/transactions.ts
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

/**
 * ============================
 * Tipos do domínio / helpers
 * ============================
 */

// Schema REAL da tabela no Supabase
export type TransactionDB = {
  id: string;
  user_id: string;
  type: "income" | "expense";
  category: string;
  date: string; // timestamptz ISO (ex.: 2025-10-05T00:00:00.000Z)
  description: string | null;
  account: string | null; // opcional
  value: number; // numeric
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

// Modelo usado na UI. Mantemos value/account (nativos) e
// expomos amount/note APENAS para compatibilidade de quem ainda lê esses nomes.
export type Transaction = {
  id: string;
  user_id: string;
  type: "income" | "expense";
  category: string;
  date: string; // ISO
  description: string | null;
  account: string | null;
  value: number;

  // compat (somente leitura):
  amount: number;
  note: string | null;

  created_at: string;
  updated_at: string;
};

// Entrada flexível para criação/edição: aceita value/account (preferidos)
// ou amount/note (compatibilidade).
export type TxUpsertInput = {
  user_id: string;
  type: "income" | "expense";
  category: string;
  // aceita "YYYY-MM-DD" ou ISO completo
  date: string;
  description?: string | null;
  account?: string | null;
  value?: number;

  // compat:
  amount?: number;
  note?: string | null;
};

export type TxType = "income" | "expense";

function startOfDayISO(yyyy_mm_dd_or_iso: string): string {
  // Se veio YYYY-MM-DD, padroniza com 00:00Z. Se já veio ISO completo, só retorna.
  if (/^\d{4}-\d{2}-\d{2}$/.test(yyyy_mm_dd_or_iso)) {
    return `${yyyy_mm_dd_or_iso}T00:00:00.000Z`;
  }
  return yyyy_mm_dd_or_iso;
}

function fromDB(row: TransactionDB): Transaction {
  return {
    ...row,
    amount: row.value, // compat
    note: row.account, // compat
  };
}

function toDBPayload(input: TxUpsertInput): Omit<TransactionDB, "id" | "created_at" | "updated_at"> & {
  created_at?: string;
  updated_at?: string;
} {
  const value =
    typeof input.value === "number"
      ? input.value
      : typeof input.amount === "number"
      ? input.amount
      : NaN;

  return {
    user_id: input.user_id,
    type: input.type,
    category: input.category,
    date: startOfDayISO(input.date),
    description: input.description ?? null,
    account:
      (typeof input.account === "string" ? input.account : undefined) ??
      (typeof input.note === "string" ? input.note : null),
    value,
  } as any;
}

/**
 * ============================
 * Estado do Store
 * ============================
 */

type TransactionsState = {
  items: Transaction[];
  loading: boolean;
  error: string | null;

  // actions
  fetchAll: (userId: string) => Promise<void>;
  addTransaction: (input: TxUpsertInput) => Promise<Transaction>;
  updateTransaction: (
    id: string,
    input: Partial<TxUpsertInput>
  ) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;

  // aliases p/ compatibilidade com a UI antiga
  add: (input: TxUpsertInput) => Promise<Transaction>;
  create: (input: TxUpsertInput) => Promise<Transaction>;
  createTransaction: (input: TxUpsertInput) => Promise<Transaction>;
  update: (id: string, input: Partial<TxUpsertInput>) => Promise<Transaction>;
  remove: (id: string) => Promise<void>;

  // computed
  incomeTotal: number;
  expenseTotal: number;
  lastTransaction: Transaction | null;
};

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  /**
   * Busca todas as transações do usuário (ordenadas por data desc, depois created_at desc)
   */
  fetchAll: async (userId: string) => {
    if (!userId) {
      set({ error: "userId ausente.", loading: false });
      return;
    }
    set({ loading: true, error: null });

    const { data, error } = await supabase
      .from("transactions")
      .select(
        "id,user_id,type,category,date,description,account,value,created_at,updated_at"
      )
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }

    const mapped = (data ?? []).map(fromDB);
    set({
      items: mapped,
      loading: false,
      error: null,
      incomeTotal: mapped
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + (t.value || 0), 0),
      expenseTotal: mapped
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + (t.value || 0), 0),
      lastTransaction: mapped[0] ?? null,
    });
  },

  /**
   * Cria transação
   */
  addTransaction: async (input: TxUpsertInput) => {
    if (!input?.user_id) throw new Error("user_id é obrigatório.");

    const payload = toDBPayload(input);
    if (!Number.isFinite(payload.value) || (payload.value as number) <= 0) {
      throw new Error("Valor inválido (value/amount).");
    }

    // created_at/updated_at são NOT NULL no seu schema — garantimos aqui
    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        ...payload,
        created_at: nowIso,
        updated_at: nowIso,
      })
      .select(
        "id,user_id,type,category,date,description,account,value,created_at,updated_at"
      )
      .single();

    if (error) throw new Error(error.message);

    const created = fromDB(data as TransactionDB);

    // atualiza estado
    const items = [created, ...get().items].sort((a, b) =>
      a.date > b.date ? -1 : a.date < b.date ? 1 : 0
    );

    set({
      items,
      incomeTotal: items
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + (t.value || 0), 0),
      expenseTotal: items
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + (t.value || 0), 0),
      lastTransaction: items[0] ?? null,
    });

    return created;
  },

  /**
   * Atualiza transação
   */
  updateTransaction: async (id, input) => {
    if (!id) throw new Error("id é obrigatório.");

    const payloadRaw = toDBPayload({
      // usamos valores existentes como defaults para evitar invalidar campos obrigatórios
      user_id:
        input.user_id ??
        get().items.find((t) => t.id === id)?.user_id ??
        "missing",
      type:
        (input.type as TxType) ??
        (get().items.find((t) => t.id === id)?.type as TxType) ??
        "expense",
      category:
        input.category ?? get().items.find((t) => t.id === id)?.category ?? "",
      date:
        input.date ??
        get().items.find((t) => t.id === id)?.date ??
        new Date().toISOString(),
      description:
        input.description ??
        get().items.find((t) => t.id === id)?.description ??
        null,
      account:
        input.account ??
        (input.note as any) ??
        get().items.find((t) => t.id === id)?.account ??
        null,
      value:
        input.value ??
        (input.amount as any) ??
        get().items.find((t) => t.id === id)?.value ??
        NaN,
      note: input.note,
      amount: input.amount,
    });

    // NÃO envie created_at; só atualize updated_at.
    const { data, error } = await supabase
      .from("transactions")
      .update({
        ...payloadRaw,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        "id,user_id,type,category,date,description,account,value,created_at,updated_at"
      )
      .single();

    if (error) throw new Error(error.message);

    const updated = fromDB(data as TransactionDB);

    const items = get()
      .items.map((t) => (t.id === id ? updated : t))
      .sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));

    set({
      items,
      incomeTotal: items
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + (t.value || 0), 0),
      expenseTotal: items
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + (t.value || 0), 0),
      lastTransaction: items[0] ?? null,
    });

    return updated;
  },

  /**
   * Deleta transação
   */
  deleteTransaction: async (id: string) => {
    if (!id) throw new Error("id é obrigatório.");

    const prev = get().items;
    set({ items: prev.filter((t) => t.id !== id) }); // otimista

    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      // rollback
      set({ items: prev });
      throw new Error(error.message);
    }

    const items = get().items;
    set({
      incomeTotal: items
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + (t.value || 0), 0),
      expenseTotal: items
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + (t.value || 0), 0),
      lastTransaction: items[0] ?? null,
    });
  },

  // ===== Aliases de compatibilidade =====

  add: async (i) => get().addTransaction(i),
  create: async (i) => get().addTransaction(i),
  createTransaction: async (i) => get().addTransaction(i),
  update: async (id, i) => get().updateTransaction(id, i),
  remove: async (id) => get().deleteTransaction(id),

  // computed iniciais (vão ser recalculados a cada set)
  incomeTotal: 0,
  expenseTotal: 0,
  lastTransaction: null,
}));
