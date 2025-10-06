"use client";

import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { useTransactionsStore } from "@/store/transactions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function parseAmount(value: string) {
  const num = parseFloat(value.replace(",", "."));
  return Number.isNaN(num) ? 0 : num;
}

export default function AddTransactionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const user = useUser();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("Você precisa estar logado para criar uma transação.");
      return;
    }

    const parsed = parseAmount(amount);
    if (!description || !Number.isFinite(parsed) || parsed <= 0) {
      toast.error("Preencha descrição e um valor maior que zero.");
      return;
    }

    // normaliza para 2 casas
    const value = Math.round(parsed * 100) / 100;

    setLoading(true);
    try {
      // Envie os NOMES DO BANCO: value / account (não amount/note)
      const payload = {
        type,
        category,
        description: description.trim(),
        value, // <-- coluna do banco
        account: account || null, // <-- coluna do banco
        date: new Date(date).toISOString(),
        // NÃO envie user_id: policy + default/trigger preenchem
      };

      const { data, error } = await supabase
        .from("transactions")
        .insert(payload)
        .select("id") // força retorno/erro explícito
        .single();

      if (error) throw error;

      // Recarrega a lista do store (fetchAll pede userId)
      const fetchAll = useTransactionsStore.getState().fetchAll;
      if (typeof fetchAll === "function") {
        await fetchAll(user.id);
      }

      toast.success(type === "income" ? "Receita adicionada!" : "Despesa adicionada!");
      onOpenChange(false);
    } catch (err: any) {
      console.error("[transactions insert] ", err);
      toast.error(err?.message || "Não foi possível salvar a transação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="Valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            placeholder="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Input
            placeholder="Conta"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
