import PageTransition from "@/components/shared/page-transition";
import { AiInvestmentSuggestions } from "@/components/dashboard/ai-investment-suggestions";
import { SmartAlerts } from "@/components/dashboard/smart-alerts";
import { OpenFinanceIntegration } from "@/components/ai-assistant/open-finance-integration";
import { PageHeader } from "@/components/shared/page-header";
import { FinancialSimulator } from "@/components/goals/financial-simulator";
import { BrainCircuit } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { hasFeature, PlanId } from "@/lib/plan";
import { UpgradeCallout } from "@/components/billing/UpgradeCallout";
import { Skeleton } from "@/components/shared/skeleton";

export default function AiAssistantPage() {
  const { profile, loading } = useAuth();
  const plan = (profile?.plan ?? "free") as PlanId;

  if (loading) {
    return (
        <PageTransition>
          <div className="space-y-6">
            <Skeleton className="h-16 w-1/2" />
            <div className="grid lg:grid-cols-2 gap-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </PageTransition>
      );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          icon={BrainCircuit}
          title="Assistente IA"
          description="Seu copiloto financeiro para decisões mais inteligentes."
        />
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
              {hasFeature(plan, 'smart_alerts') ? <SmartAlerts /> : <UpgradeCallout feature="Alertas Inteligentes" />}
              {hasFeature(plan, 'invest_suggestions') ? <AiInvestmentSuggestions /> : <UpgradeCallout feature="Sugestões de Investimento" />}
          </div>
          <div className="space-y-6">
              {hasFeature(plan, 'open_finance') ? <OpenFinanceIntegration /> : <UpgradeCallout feature="Open Finance" />}
              {hasFeature(plan, 'simulator') ? <FinancialSimulator /> : <UpgradeCallout feature="Simulador Financeiro" />}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
