import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatCurrency, getGoalStatus } from "@/lib/utils";
import { Target, PlusCircle } from "lucide-react";
import { useGoalsStore } from "@/store/goals";
import { AddContributionDialog } from "../goals/AddContributionDialog";
import { EmptyState } from "../shared/empty-state";

export function ActiveGoal() {
  const [isModalOpen, setModalOpen] = useState(false);
  const goals = useGoalsStore((state) => state.goals);
  const activeGoal = goals.find(g => getGoalStatus(g) === 'active');

  if (!activeGoal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Meta em Destaque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState 
            icon={Target}
            title="Nenhuma meta ativa"
            description="Crie uma meta para começar a acompanhar seu progresso aqui."
            className="p-0 border-none"
          />
        </CardContent>
      </Card>
    )
  }

  const progress = (activeGoal.current / activeGoal.target) * 100;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Meta em Destaque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <p className="font-semibold">{activeGoal.title}</p>
              <p className="text-sm font-bold text-primary">{progress.toFixed(0)}%</p>
            </div>
            <Progress value={progress} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency(activeGoal.current)}</span>
              <span>{formatCurrency(activeGoal.target)}</span>
            </div>
            <Button className="w-full" onClick={() => setModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Fazer Aporte
            </Button>
          </div>
        </CardContent>
      </Card>
      <AddContributionDialog 
        goal={activeGoal}
        open={isModalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
