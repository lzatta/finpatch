import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGoalsStore, Goal } from '@/store/goals';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { useChallengesStore } from '@/store/challenges';

interface AddContributionDialogProps {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddContributionDialog({ goal, open, onOpenChange }: AddContributionDialogProps) {
  const [amount, setAmount] = useState<number | string>('');
  const { addContribution } = useGoalsStore();

  const handleConfirm = async () => {
    const contributionAmount = Number(amount);
    if (contributionAmount <= 0) {
      toast.error("Por favor, insira um valor de aporte positivo.");
      return;
    }

    await addContribution(goal.id, contributionAmount);
    useChallengesStore.getState().registerAutoEvent("goal_contribution", contributionAmount);
    
    toast.success(`Aporte de ${formatCurrency(contributionAmount)} realizado com sucesso!`);
    
    setAmount('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fazer Aporte para "{goal.name}"</DialogTitle>
          <DialogDescription>
            Insira o valor que você deseja adicionar a esta meta.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor do Aporte</Label>
            <Input
              id="amount"
              type="number"
              placeholder="R$ 0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleConfirm}>Confirmar Aporte</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
