import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageTransition from "@/components/shared/page-transition";
import { AddTransactionButton } from "@/components/transactions/add-transaction-button";
import { TransactionSummary } from "@/components/transactions/transaction-summary";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionList } from "@/components/transactions/transaction-list";
import { PageHeader } from "@/components/shared/page-header";
import { ArrowRightLeft } from "lucide-react";
import { useTransactionsStore } from "@/store/transactions";
import { Skeleton } from "@/components/shared/skeleton";
import { toArray } from "@/lib/array";
import { useAuth } from "@/providers/auth-provider";
import { QuickActions } from "@/components/transactions/quick-actions";

export default function TransactionsPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const { user } = useAuth();

  const { transactions = [], loading, fetchAll } = useTransactionsStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");

  // Carregar as transações ao logar
  useEffect(() => {
    if (user?.id) {
      fetchAll(user.id); 
      console.log("Transações carregadas:", transactions); // Verificar transações após carregar
    } else {
      console.log("Usuário não está logado ou ID não encontrado.");
    }
  }, [user?.id, fetchAll]);

  const safeTransactions = toArray(transactions);

  const filteredTransactions = useMemo(() => {
    return safeTransactions.filter(tx => {
      const categoryMatch = selectedCategory === "all" || tx.category === selectedCategory;
      const searchMatch = tx.description.toLowerCase().includes(searchTerm.trim().toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [safeTransactions, selectedCategory, searchTerm]);

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          icon={ArrowRightLeft}
          title="Transações"
          description="Gerencie suas receitas e despesas."
          actionComponent={<AddTransactionButton />}
        />

        {/* Exibe o Skeleton durante o carregamento */}
        {loading ? (
          <Skeleton className="h-24 w-full" />
        ) : transactions.length === 0 ? (
          <p>Não há transações para exibir.</p>
        ) : (
          <TransactionSummary />
        )}

        {/* Filtros de transações */}
        <TransactionFilters 
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        {/* Lista de transações filtradas */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransactionList transactions={filteredTransactions} loading={loading} />
          </div>
          <div className="space-y-6">
            <QuickActions />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
