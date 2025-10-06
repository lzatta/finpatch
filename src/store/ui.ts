import { create } from "zustand";
import { Transaction } from "@/store/transactions";

type UIState = {
  isAddTransactionOpen: boolean;
  transactionModalInitialType: 'income' | 'expense';
  transactionModalInitialData: Partial<Omit<Transaction, "id">> | null;
  isAddGoalOpen: boolean;
  openAddTransactionModal: (type: 'income' | 'expense', initialData?: Partial<Omit<Transaction, "id">>) => void;
  openAddGoalModal: () => void;
  closeAllModals: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isAddTransactionOpen: false,
  transactionModalInitialType: 'expense',
  transactionModalInitialData: null,
  isAddGoalOpen: false,
  openAddTransactionModal: (type, initialData) => set({ 
    isAddTransactionOpen: true, 
    transactionModalInitialType: type,
    transactionModalInitialData: initialData || null,
  }),
  openAddGoalModal: () => set({ isAddGoalOpen: true }),
  closeAllModals: () => set({ 
    isAddTransactionOpen: false, 
    isAddGoalOpen: false,
    transactionModalInitialData: null,
  }),
}));
