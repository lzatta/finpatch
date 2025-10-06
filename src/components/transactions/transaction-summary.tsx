import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useTransactionsStore } from "@/store/transactions";
import { toArray } from "@/lib/safe";

export function TransactionSummary() {
  const { items, incomeTotal, expenseTotal } = useTransactionsStore();

  const tx = toArray(items);

  const computed = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const t of tx) {
      const amount = Number(t?.amount ?? 0);
      if (!Number.isFinite(amount)) continue;
      if (t.type === "income") inc += amount;
      else if (t.type === "expense") exp += amount;
    }
    return { inc, exp };
  }, [tx]);

  const totalIncome = typeof incomeTotal === 'function' ? incomeTotal() : computed.inc;
  const totalExpense = typeof expenseTotal === 'function' ? expenseTotal() : computed.exp;

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas (Mês)</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas (Mês)</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo (Mês)</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
