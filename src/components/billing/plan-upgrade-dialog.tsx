"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Users } from "lucide-react";
import { PlanId } from "@/lib/plan";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  reason: string;
  requiredPlan: PlanId;
};

export default function PlanUpgradeDialog({ open, onOpenChange, reason, requiredPlan }: Props) {
  const nav = useNavigate();
  const isFamily = requiredPlan === "family";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isFamily ? <Users className="h-5 w-5 text-purple-600" /> : <Crown className="h-5 w-5 text-purple-600" />}
            {isFamily ? "Recurso do Plano Família" : "Recurso do Plano Premium"}
          </DialogTitle>
          <DialogDescription className="pt-2">{reason}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => nav(isFamily ? "/onboarding/plans?family=true" : "/onboarding/plans")}>
            {isFamily ? "Conhecer Plano Família" : "Conhecer Plano Premium"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
