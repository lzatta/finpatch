export type PlanId = "free" | "basic" | "premium" | "family";

/** Features checadas em UI/rotas/botões */
export type FeatureKey =
  | "family"
  | "ai_insights"
  | "smart_alerts"
  | "invest_suggestions"
  | "simulator"
  | "advanced_charts"
  | "open_finance"
  | "export"
  | "challenges"
  | "history_24m"
  | "shared_goals"
  | "family_avatars_fx";

/** Quotas/limites numéricos */
export type QuotaKey = "max_goals" | "max_family_members";

export const PLAN_FEATURES: Record<PlanId, FeatureKey[]> = {
  free: [],
  basic: [],
  premium: [
    "ai_insights",
    "smart_alerts",
    "invest_suggestions",
    "simulator",
    "advanced_charts",
    "open_finance",
    "export",
    "challenges",
    "history_24m",
  ],
  family: [
    "family",
    "shared_goals",
    "family_avatars_fx",
    "ai_insights",
    "smart_alerts",
    "invest_suggestions",
    "simulator",
    "advanced_charts",
    "open_finance",
    "export",
    "challenges",
    "history_24m",
  ],
};

export const PLAN_QUOTAS: Record<PlanId, Partial<Record<QuotaKey, number>>> = {
  free: { max_goals: 1 },
  basic: { max_goals: 3 },
  premium: { max_goals: Number.POSITIVE_INFINITY },
  family: {
    max_goals: Number.POSITIVE_INFINITY,
    max_family_members: 6,
  },
};

// --- Funções seguras ---

type AnyPlan = string | null | undefined;
const KNOWN_PLANS: PlanId[] = ["free", "basic", "premium", "family"];

export function normalizePlan(plan: AnyPlan): PlanId {
  const k = String(plan ?? "").toLowerCase() as PlanId;
  return (KNOWN_PLANS as string[]).includes(k) ? k : "free";
}

function getPlanFeatures(plan?: AnyPlan): string[] {
  const key = normalizePlan(plan);
  return PLAN_FEATURES[key] ?? [];
}

export function hasFeature(plan?: AnyPlan, feature?: string): boolean {
  if (!feature) return false;
  
  const key = normalizePlan(plan);

  const trialEnds = typeof localStorage !== 'undefined' ? Number(localStorage.getItem("finpatch/trialEnds") ?? 0) : 0;
  const isTrialActive = trialEnds > 0 && Date.now() < trialEnds;

  if (isTrialActive) {
      if (PLAN_FEATURES['premium'].includes(feature as FeatureKey)) return true;
  }

  const list = getPlanFeatures(key);
  return list.includes(feature as FeatureKey);
}

export const getQuota = (plan: PlanId, quota: QuotaKey) =>
  PLAN_QUOTAS[plan]?.[quota] ?? Number.POSITIVE_INFINITY;

export function targetPlanFor(feature: FeatureKey): PlanId {
  switch (feature) {
    case "family":
    case "shared_goals":
    case "family_avatars_fx":
      return "family";
    default:
      return "premium";
  }
}

export function isPaidPlan(plan?: AnyPlan): boolean {
  const key = normalizePlan(plan);
  return key === "premium" || key === "family";
}
