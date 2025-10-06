"use client"

import { useState, useMemo } from "react"
import { useGoalsStore } from "@/store/goals"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
import { Info } from "lucide-react"

export function CreateGoalForm({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const addGoal = useGoalsStore(s => s.addGoal)
  const [name, setName] = useState("")
  const [target_value, setTargetValue] = useState("")
  const [deadline, setDeadline] = useState("")
  const [monthly_contribution, setMonthlyContribution] = useState("")

  const estimation = useMemo(() => {
    const targetNum = Number(target_value);
    const monthlyNum = Number(monthly_contribution);

    if (targetNum > 0 && monthlyNum > 0) {
      const monthsRemaining = Math.ceil(targetNum / monthlyNum);
      if (monthsRemaining === Infinity || isNaN(monthsRemaining)) return null;

      const etaDate = new Date();
      etaDate.setMonth(etaDate.getMonth() + monthsRemaining);

      const formattedDate = etaDate.toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric'
      });

      return {
        months: monthsRemaining,
        date: formattedDate,
      };
    }
    return null;
  }, [target_value, monthly_contribution]);

  const handleSave = async () => {
    const targetNum = Number(target_value)
    if (!name || !Number.isFinite(targetNum) || targetNum <= 0) {
      toast.error("Preencha um título e um valor alvo válido.")
      return
    }
    const goal = await addGoal({
      name,
      target_value: targetNum,
      deadline: deadline || undefined,
      monthly_contribution: Number(monthly_contribution) || undefined,
    });
    
    if(goal) {
        toast.success("Meta criada com sucesso!")
        setName(""); setTargetValue(""); setDeadline(""); setMonthlyContribution("")
        onOpenChange(false)
    } else {
        toast.error("Não foi possível criar a meta.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Meta</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => { e.preventDefault(); handleSave() }}
        >
          <div className="grid gap-3">
            <Input placeholder="Nome da meta" value={name} onChange={e=>setName(e.target.value)} />
            <Input type="number" placeholder="Valor alvo (R$)" value={target_value} onChange={e=>setTargetValue(e.target.value)} />
            <Input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} />
            <Input type="number" placeholder="Aporte mensal (opcional)" value={monthly_contribution} onChange={e=>setMonthlyContribution(e.target.value)} />
          </div>

          {estimation && (
            <div className="p-3 bg-accent/50 rounded-lg text-sm text-muted-foreground flex items-start gap-3">
              <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <div>
                Com um aporte de {formatCurrency(Number(monthly_contribution))}, você alcançará sua meta em aproximadamente <strong>{estimation.months} {estimation.months > 1 ? 'meses' : 'mês'}</strong>.
                <br />
                Data estimada para conclusão: <strong>{estimation.date}</strong>.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="submit">Salvar Meta</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
