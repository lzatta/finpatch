"use client";
import { Navigate } from "react-router-dom";
import { hasFeature, PlanId, FeatureKey } from "@/lib/plan";
import { useAuth } from "@/providers/auth-provider";

export default function ProtectedFeatureRoute({
  feature,
  children,
}: {
  feature: FeatureKey;
  children: React.ReactNode;
}) {
  const { profile } = useAuth();
  const plan = (profile?.plan ?? "free") as PlanId;

  // Regra DURA: Família apenas no Plano Família
  if (feature === "family" && plan !== "family") {
    return <Navigate to="/onboarding/plans?family=true" replace />;
  }

  if (!hasFeature(plan, feature)) {
    return <Navigate to="/onboarding/plans" replace />;
  }

  return <>{children}</>;
}
