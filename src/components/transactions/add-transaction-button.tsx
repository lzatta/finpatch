"use client"

import { Button } from "@/components/ui/button"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"
import { PlusCircle } from "lucide-react"
import { useUIStore } from "@/store/ui"

export function AddTransactionButton() {
  const { isAddTransactionOpen, openAddTransactionModal, closeAllModals } = useUIStore();
  return (
    <>
      <Button onClick={() => openAddTransactionModal('expense')}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nova Transação
      </Button>
      <AddTransactionDialog open={isAddTransactionOpen} onOpenChange={closeAllModals} />
    </>
  )
}
