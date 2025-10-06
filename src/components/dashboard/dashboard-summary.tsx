import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Smile, TrendingUp, PiggyBank, Bell } from "lucide-react";

const summaryData = {
  healthScore: 85,
  healthStatus: "Boa",
  nextMonthForecast: 13250.00,
  forecastChange: "+5.8%",
  savingsRate: 22,
  savingsTarget: 20,
  alertsCount: 3,
};

const StatCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Card className={`hover:-translate-y-1 hover:shadow-xl ${className}`}>
        {children}
    </Card>
);

export function DashboardSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saúde Financeira IA</CardTitle>
          <Smile className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summaryData.healthScore}/100</div>
          <div className="flex items-center gap-2">
            <Progress value={summaryData.healthScore} className="h-2" />
            <Badge variant="success">{summaryData.healthStatus}</Badge>
          </div>
        </CardContent>
      </StatCard>
      <StatCard>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Previsão Próximo Mês</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summaryData.nextMonthForecast)}</div>
          <p className="text-xs text-success">{summaryData.forecastChange} em relação a este mês</p>
        </CardContent>
      </StatCard>
      <StatCard>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Poupança</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summaryData.savingsRate}%</div>
          <p className="text-xs text-muted-foreground">Meta: {summaryData.savingsTarget}%</p>
        </CardContent>
      </StatCard>
      <StatCard>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alertas IA</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summaryData.alertsCount}</div>
          <p className="text-xs text-muted-foreground">1 crítico, 2 avisos</p>
        </CardContent>
      </StatCard>
    </div>
  );
}
