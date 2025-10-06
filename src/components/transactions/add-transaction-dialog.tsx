// /src/components/transactions/add-transaction-dialog.tsx
"use client";

import * as React from "react";
import { useTransactionsStore, type TxType } from "@/store/transactions";
import { useAuth } from "@/providers/auth-provider";
import { useUIStore } from "@/store/ui";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";

import { supabase } from "@/lib/supabase";

// ⚙️ Lê URL/KEY do .env (usados no fallback REST)
const SB_URL = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const SB_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const CATEGORIES = [
  "Salário","Freelance","Aluguel","Mercado","Transporte","Lazer",
  "Saúde","Educação","Assinaturas","Outros",
] as const;
type TxCategory = (typeof CATEGORIES)[number];

function toStartOfDayISO(d: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00.000Z` : d;
}
function parseMoney(text: string): number {
  const n = Number(text.trim().replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

// fallback REST (respeita RLS via Bearer token)
async function restInsertTransaction(payload: any, token: string) {
  if (!SB_URL || !SB_ANON) throw new Error("Credenciais Supabase ausentes.");
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 7000);
  try {
    const res = await fetch(`${SB_URL}/rest/v1/transactions?select=*`, {
      method: "POST",
      headers: {
        apikey: SB_ANON,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
      signal: ac.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const e: any = new Error(data?.message || "Falha no insert (REST)");
      e.hint = data?.hint;
      e.details = data?.details;
      throw e;
    }
    return Array.isArray(data) ? data[0] : data;
  } finally {
    clearTimeout(timer);
  }
}

export function AddTransactionDialog({
  open,
  onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { user } = useAuth();
  const { transactionModalInitialType, transactionModalInitialData } = useUIStore();

  const [type, setType] = React.useState<TxType>(transactionModalInitialType);
  const [description, setDescription] = React.useState("");
  const [amountText, setAmountText] = React.useState<string>("");
  const [category, setCategory] = React.useState<TxCategory>("Outros");
  const [date, setDate] = React.useState<string>(new Date().toISOString().slice(0, 10));
  const [account, setAccount] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setType(transactionModalInitialType);
    setDescription(transactionModalInitialData?.description || "");
    setAmountText(
      transactionModalInitialData?.value != null
        ? String(transactionModalInitialData.value)
        : transactionModalInitialData?.amount != null
        ? String(transactionModalInitialData.amount)
        : ""
    );
    setCategory((transactionModalInitialData?.category as TxCategory) || "Outros");
    setDate(
      transactionModalInitialData?.date
        ? new Date(transactionModalInitialData.date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10)
    );
    setAccount(transactionModalInitialData?.account ?? transactionModalInitialData?.note ?? "");
  }, [open, transactionModalInitialType, transactionModalInitialData]);

  async function handleSave() {
    if (loading) return;
    setLoading(true);

    try {
      if (!user?.id) {
        toast.error("Você precisa estar logado para criar uma transação.");
        return;
      }

      const value = parseMoney(amountText);
      if (!description.trim() || !Number.isFinite(value) || value <= 0) {
        toast.error("Informe uma descrição e um valor válido maior que zero.");
        return;
      }

      const nowIso = new Date().toISOString();
      const payload = {
        user_id: user.id,
        type,
        category,
        date: toStartOfDayISO(date),
        description: description.trim(),
        account: account?.trim() || null,
        value,
        created_at: nowIso,
        updated_at: nowIso,
      };

      console.log("[AddTx] payload:", payload);

      let inserted: any | null = null;

      // 1) Tenta via supabase-js com timeout curto (7s) para não estourar o canal do Dualite
      try {
        const res = await Promise.race([
          supabase.from("transactions").insert(payload).select("*").single(),
          new Promise((_, r) => setTimeout(() => r(new Error("Timeout client (7s)")), 7000)),
        ]);
        if ((res as any)?.error) throw (res as any).error;
        inserted = (res as any)?.data ?? res;
        console.log("[AddTx] via client OK:", inserted);
      } catch (e) {
        console.warn("[AddTx] client falhou/timeout, tentando REST…", e);
      }

      // 2) Fallback REST com token do usuário (garante RLS)
      if (!inserted) {
        const { data: sess } = await supabase.auth.getSession();
        const token = sess?.session?.access_token;
        if (!token) throw new Error("Sessão expirada. Faça login novamente.");
        inserted = await restInsertTransaction(payload, token);
        console.log("[AddTx] via REST OK:", inserted);
      }

      // 3) Atualiza lista
      const fetchAll = (useTransactionsStore.getState() as any)?.fetchAll;
      if (typeof fetchAll === "function") {
        try { await fetchAll(user.id); } catch (e) { console.warn("fetchAll falhou:", e); }
      }

      toast.success(type === "income" ? "Receita adicionada!" : "Despesa adicionada!");
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.message || err?.hint || "Não foi possível salvar a transação.";
      toast.error(msg);
      console.error("[AddTx] erro geral:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {type === "income" ? "Adicionar Receita" : "Adicionar Despesa"}
          </DialogTitle>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v: TxType) => setType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Categoria</Label>
              <Select value={category} onValueChange={(v: TxCategory) => setCategory(v)}>
                <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Valor (R$)</Label>
              <Input inputMode="decimal" placeholder="0,00"
                     value={amountText} onChange={(e) => setAmountText(e.target.value)} />
            </div>
            <div>
              <Label>Data</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Descrição</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)}
                   placeholder="Ex.: Supermercado" />
          </div>

          <div>
            <Label>Conta (opcional)</Label>
            <Input value={account} onChange={(e) => setAccount(e.target.value)}
                   placeholder="Ex.: Nubank ou Carteira" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
