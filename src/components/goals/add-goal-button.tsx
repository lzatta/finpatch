"use client"
import { Button } from "@/components/ui/button"
import { CreateGoalForm } from "@/components/goals/create-goal-form"
import { PlusCircle } from "lucide-react"
import { useUIStore } from "@/store/ui"

export function AddGoalButton() {
  const { isAddGoalOpen, openAddGoalModal, closeAllModals } = useUIStore();
  return (
    <>
      <Button onClick={openAddGoalModal}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nova Meta
      </Button>
      <CreateGoalForm open={isAddGoalOpen} onOpenChange={closeAllModals} />
    </>
  )
}
