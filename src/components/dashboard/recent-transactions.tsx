import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useTransactionsStore } from "@/store/transactions";

export function RecentTransactions() {
  const { transactions } = useTransactionsStore();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>Suas últimas movimentações.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center">
              <div className={`p-2 rounded-full mr-4 ${tx.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {tx.type === 'income' ? <ArrowUpRight className="h-5 w-5 text-green-500" /> : <ArrowDownLeft className="h-5 w-5 text-red-500" />}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium leading-none">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className={`text-sm font-semibold ${tx.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
              </div>
            </div>
          ))}
        </div>
        <Button asChild variant="link" className="w-full mt-4">
            <Link to="/transactions">Ver todas as transações</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
