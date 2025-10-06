"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Goal } from "@/store/goals";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { Target } from 'lucide-react';
import { EmptyState } from '../shared/empty-state';
import { cn } from "@/lib/utils";
import { useGoalsStore } from "@/store/goals";
import { AddGoalButton } from "./add-goal-button";

const GoalCard = ({ goal, onSelect, isSelected }: { goal: Goal, onSelect: (id: string) => void, isSelected: boolean }) => {
  const progress = (goal.target_value > 0) ? (goal.current_value / goal.target_value) * 100 : 0;
  return (
    <Card 
      className={cn(
        "hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer",
        isSelected && "ring-2 ring-primary"
      )} 
      onClick={() => onSelect(goal.id)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <p className="font-semibold">{goal.name}</p>
        </div>
        <Progress value={progress} className="h-2 my-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(goal.current_value)}</span>
          <span>{formatCurrency(goal.target_value)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface GoalsListProps {
  onSelectGoal: (id: string) => void;
  selectedGoalId: string | null;
}

export function GoalsList({ onSelectGoal, selectedGoalId }: GoalsListProps) {
  const { goals } = useGoalsStore();

  const renderGoalList = (status: Goal['status']) => {
    const filteredGoals = goals.filter(g => g.status === status);
    if (filteredGoals.length === 0) {
      return (
        <EmptyState 
            icon={Target}
            title={`Nenhuma meta ${status}`}
            description="Crie uma nova meta para começar a planejar seu futuro financeiro."
            actionComponent={<AddGoalButton />}
            className="mt-4"
        />
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {filteredGoals.map(goal => <GoalCard key={goal.id} goal={goal} onSelect={onSelectGoal} isSelected={goal.id === selectedGoalId} />)}
      </div>
    );
  };

  return (
    <Tabs defaultValue="active">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="active">Ativas</TabsTrigger>
        <TabsTrigger value="completed">Concluídas</TabsTrigger>
        <TabsTrigger value="expired">Vencidas</TabsTrigger>
      </TabsList>
      <TabsContent value="active">{renderGoalList('active')}</TabsContent>
      <TabsContent value="completed">{renderGoalList('completed')}</TabsContent>
      <TabsContent value="expired">{renderGoalList('expired')}</TabsContent>
    </Tabs>
  );
}
