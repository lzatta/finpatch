"use client"
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, CalendarClock, Zap, Target } from 'lucide-react';
import { useGoalsStore } from '@/store/goals';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from '../shared/empty-state';

export function FinancialSimulator() {
  const { goals } = useGoalsStore();
  const activeGoals = useMemo(() => goals.filter(g => g.status === 'active'), [goals]);

  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>(activeGoals[0]?.id);
  const [extraContribution, setExtraContribution] = useState(50);
  const [costCutting, setCostCutting] = useState(100);

  useEffect(() => {
    const selectedGoalIsActive = activeGoals.some(g => g.id === selectedGoalId);
    if (!selectedGoalId || !selectedGoalIsActive) {
      setSelectedGoalId(activeGoals.length > 0 ? activeGoals[0].id : undefined);
    }
  }, [activeGoals, selectedGoalId]);

  const selectedGoal = useMemo(() => {
    return goals.find(g => g.id === selectedGoalId);
  }, [selectedGoalId, goals]);

  const simulation = useMemo(() => {
    if (!selectedGoal || !selectedGoal.monthly_contribution || selectedGoal.monthly_contribution <= 0) {
      return null;
    }

    const remainingAmount = Math.max(0, selectedGoal.target_value - selectedGoal.current_value);
    const originalMonthly = selectedGoal.monthly_contribution;
    const effectiveMonthly = originalMonthly + extraContribution + costCutting;

    const originalMonths = originalMonthly > 0 ? Math.ceil(remainingAmount / originalMonthly) : Infinity;
    const newMonths = effectiveMonthly > 0 ? Math.ceil(remainingAmount / effectiveMonthly) : Infinity;
    
    const monthsSaved = (isFinite(originalMonths) && isFinite(newMonths)) ? Math.max(0, originalMonths - newMonths) : 0;
    
    const newEtaDate = new Date();
    if (isFinite(newMonths)) {
        newEtaDate.setMonth(newEtaDate.getMonth() + newMonths);
    }

    return {
      monthsSaved,
      newMonths: isFinite(newMonths) ? newMonths : '∞',
      newEtaDate: isFinite(newMonths) ? newEtaDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }) : 'Nunca',
      effectiveMonthly,
    };
  }, [selectedGoal, extraContribution, costCutting]);

  const renderContent = () => {
    if (activeGoals.length === 0) {
        return (
            <EmptyState 
                icon={Target}
                title="Nenhuma meta ativa para simular"
                description="Crie uma meta com um aporte mensal para usar o simulador."
                className="border-none p-4"
            />
        );
    }

    if (!selectedGoal) {
        return <p className="text-muted-foreground text-center p-4">Selecione uma meta para começar a simulação.</p>;
    }
    
    if (!selectedGoal.monthly_contribution || selectedGoal.monthly_contribution <= 0) {
        return (
             <EmptyState 
                icon={Target}
                title="Aporte mensal não definido"
                description={`Para simular cenários para a meta "${selectedGoal.name}", por favor, defina um aporte mensal para ela.`}
                className="border-none p-4"
            />
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="extra-contribution">Aporte Extra Mensal: {formatCurrency(extraContribution)}</Label>
                    <Slider id="extra-contribution" value={[extraContribution]} max={1000} step={10} onValueChange={(value) => setExtraContribution(value[0])} />
                </div>
                <div>
                    <Label htmlFor="cost-cutting">Corte de Gastos Mensal: {formatCurrency(costCutting)}</Label>
                    <Slider id="cost-cutting" value={[costCutting]} max={1000} step={10} onValueChange={(value) => setCostCutting(value[0])} />
                </div>
            </div>
            {simulation && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-6">
                    <Card className="bg-blue-500/10 border-blue-500/20">
                        <CardContent className="p-4">
                        <TrendingUp className="mx-auto h-6 w-6 text-blue-500 mb-2" />
                        <p className="text-lg font-bold">{simulation.monthsSaved > 0 ? `${simulation.monthsSaved} meses` : 'Sem mudança'}</p>
                        <p className="text-xs text-muted-foreground">{simulation.monthsSaved > 0 ? 'a menos no prazo' : '(ajuste os sliders)'}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-purple-500/10 border-purple-500/20">
                        <CardContent className="p-4">
                        <CalendarClock className="mx-auto h-6 w-6 text-purple-500 mb-2" />
                        <p className="text-lg font-bold">{simulation.newMonths} meses</p>
                        <p className="text-xs text-muted-foreground">Novo prazo ({simulation.newEtaDate})</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-500/10 border-green-500/20">
                        <CardContent className="p-4">
                        <Zap className="mx-auto h-6 w-6 text-green-500 mb-2" />
                        <p className="text-lg font-bold">{formatCurrency(simulation.effectiveMonthly)}</p>
                        <p className="text-xs text-muted-foreground">Novo aporte mensal</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
                <CardTitle>Simulador Financeiro</CardTitle>
                <CardDescription>Veja o impacto de pequenas mudanças em suas metas.</CardDescription>
            </div>
            {activeGoals.length > 0 && (
                <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
                    <SelectTrigger className="w-full sm:w-[250px]">
                        <SelectValue placeholder="Selecione uma meta..." />
                    </SelectTrigger>
                    <SelectContent>
                        {activeGoals.map(goal => (
                            <SelectItem key={goal.id} value={goal.id}>{goal.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
