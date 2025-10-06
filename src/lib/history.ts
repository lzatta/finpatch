import { PlanId } from "./plan";

export function historyMonthsFor(plan: PlanId) {
  if (plan === "premium" || plan === "family") return 24;
  return 3;
}
