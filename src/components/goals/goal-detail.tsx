"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Goal } from "@/store/goals";
import { formatCurrency } from "@/lib/utils";
import { PlusCircle, BrainCircuit } from "lucide-react";
import { AddContributionDialog } from "./AddContributionDialog";

interface GoalDetailProps {
  goal: Goal;
  onGoalCompleted: () => void;
}

export function GoalDetail({ goal, onGoalCompleted }: GoalDetailProps) {
  const [isContributionModalOpen, setContributionModalOpen] = useState(false);
  const [wasCompleted, setWasCompleted] = useState(goal.status === 'completed');

  const progress = (goal.target_value > 0) ? Math.min(100, (goal.current_value / goal.target_value) * 100) : 0;
  const daysLeft = goal.deadline ? Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : null;

  useEffect(() => {
    const isNowCompleted = goal.status === 'completed';
    if (isNowCompleted && !wasCompleted) {
      onGoalCompleted();
      setWasCompleted(true);
    } else if (!isNowCompleted && wasCompleted) {
      setWasCompleted(false);
    }
  }, [goal, onGoalCompleted, wasCompleted]);

  return (
    <>
      <Card className="sticky top-24">
        <CardHeader>
          <div className="flex justify-between items-start">
              <div>
                  <CardTitle>{goal.name}</CardTitle>
              </div>
              {daysLeft !== null && <Badge variant={daysLeft < 30 ? 'destructive' : 'secondary'}>{daysLeft} dias restantes</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
              <p className="text-3xl font-bold">{formatCurrency(goal.current_value)}</p>
              <p className="text-sm text-muted-foreground">de {formatCurrency(goal.target_value)}</p>
          </div>
          <Progress value={progress} />
          
          <div className="bg-accent/50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-primary" /> Sugestão da IA</h4>
              <p className="text-sm text-muted-foreground">Aportar +{formatCurrency(150)} por mês pode adiantar sua meta em 3 semanas.</p>
          </div>

          {goal.status !== 'completed' && (
            <Button className="w-full" onClick={() => setContributionModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Fazer Aporte
            </Button>
          )}
        </CardContent>
      </Card>
      <AddContributionDialog 
        goal={goal}
        open={isContributionModalOpen}
        onOpenChange={setContributionModalOpen}
      />
    </>
  );
}
