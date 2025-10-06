import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TxCategory } from "@/store/transactions";

const CATEGORIES: TxCategory[] = [
    "Salário","Freelance","Aluguel","Mercado","Transporte","Lazer","Saúde","Educação","Assinaturas","Outros"
]

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export function TransactionFilters({
  searchTerm,
  onSearchTermChange,
  selectedPeriod,
  onPeriodChange,
  selectedCategory,
  onCategoryChange,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative w-full sm:w-auto sm:flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          id="transaction-search"
          placeholder="Buscar transações... (F)" 
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="this-week">Esta Semana</SelectItem>
          <SelectItem value="this-month">Este Mês</SelectItem>
          <SelectItem value="this-year">Este Ano</SelectItem>
        </SelectContent>
      </Select>
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
