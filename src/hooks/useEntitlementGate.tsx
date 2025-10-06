"use client";
import { useState, useCallback } from "react";
import { hasFeature, getQuota, targetPlanFor, FeatureKey, QuotaKey, PlanId } from "@/lib/plan";
import PlanUpgradeDialog from "@/components/billing/plan-upgrade-dialog";
import { useAuth } from "@/providers/auth-provider";

export function useEntitlementGate() {
  const { profile } = useAuth();
  const plan = (profile?.plan ?? "free") as PlanId;
  const [dialog, setDialog] = useState<{open: boolean; reason: string; plan: PlanId} | null>(null);

  const requireFeature = useCallback((feature: FeatureKey) => {
    if (feature === "family" && plan !== "family") {
      setDialog({ open: true, reason: "Esta funcionalidade é exclusiva do Plano Família.", plan: "family" });
      return false;
    }
    if (!hasFeature(plan, feature)) {
      const p = targetPlanFor(feature);
      setDialog({ open: true, reason: "Para usar este recurso, faça upgrade para o plano compatível.", plan: p });
      return false;
    }
    return true;
  }, [plan]);

  const requireQuota = useCallback((quota: QuotaKey, currentValue: number) => {
    const max = getQuota(plan, quota);
    if (currentValue >= max) {
      const reason =
        quota === "max_goals"
          ? `Você atingiu o limite de metas do seu plano (${max}).`
          : quota === "max_family_members"
          ? `Você atingiu o limite de membros da família (${max}).`
          : "Limite do plano atingido.";
      const p: PlanId = plan === "basic" ? "premium" : "family"; // heurística
      setDialog({ open: true, reason, plan: p });
      return { ok: false, max };
    }
    return { ok: true, max };
  }, [plan]);

  const UpgradeDialog = dialog ? (
    <PlanUpgradeDialog
      open={dialog.open}
      onOpenChange={(v) => setDialog(v ? dialog : null)}
      reason={dialog.reason}
      requiredPlan={dialog.plan}
    />
  ) : null;

  return { plan, requireFeature, requireQuota, UpgradeDialog };
}
