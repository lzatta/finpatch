import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/store/transactions";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, Utensils, Home, Car, ShoppingCart, Briefcase, MoreHorizontal, FileText } from "lucide-react";
import { EmptyState } from "../shared/empty-state";
import { Skeleton } from "../shared/skeleton";
import { toast } from "sonner";

const categoryIcons: { [key: string]: React.ElementType } = {
  'Alimentação': Utensils,
  'Moradia': Home,
  'Transporte': Car,
  'Lazer': ShoppingCart,
  'Trabalho': Briefcase,
};

interface TransactionListProps {
    transactions: Transaction[];
    loading: boolean;
}

export function TransactionList({ transactions, loading }: TransactionListProps) {

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-grow space-y-2">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-3 w-2/5" />
              </div>
              <Skeleton className="h-6 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Transações</CardTitle>
        <CardDescription>Suas movimentações para o período e filtros selecionados.</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <>
            <div className="space-y-2">
              {transactions.map((tx) => {
                const Icon = categoryIcons[tx.category] || (tx.type === 'income' ? ArrowUpRight : FileText);
                return (
                  <div key={tx.id} className="flex items-center p-3 hover:bg-accent/50 rounded-lg transition-colors group">
                    <div className={`p-3 rounded-full mr-4 bg-muted`}>
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium leading-none">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</p>
                    </div>
                    <div className={`text-sm font-semibold mr-4 ${tx.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                      {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => toast('Mais opções em breve!')}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <EmptyState 
            icon={FileText}
            title="Nenhuma transação encontrada"
            description="Parece que não há movimentações para este período. Tente ajustar os filtros ou adicione uma nova transação."
          />
        )}
      </CardContent>
    </Card>
  );
}
