import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";

const summaryData = {
  balance: 12540.50,
  income: 5800.00,
  expenses: 1850.75,
  savings: 25000.00,
};

const StatCard = ({ title, value, icon: Icon, trend }: { title: string, value: number, icon: React.ElementType, trend?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{formatCurrency(value)}</div>
      {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
    </CardContent>
  </Card>
);

export function EnhancedDashboardSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Saldo Atual" value={summaryData.balance} icon={Wallet} trend="+20.1% do último mês" />
      <StatCard title="Receitas (Mês)" value={summaryData.income} icon={TrendingUp} trend="+15% do último mês" />
      <StatCard title="Despesas (Mês)" value={summaryData.expenses} icon={TrendingDown} trend="-5% do último mês" />
      <StatCard title="Total em Metas" value={summaryData.savings} icon={PiggyBank} trend="Você está no caminho certo!" />
    </div>
  );
}
