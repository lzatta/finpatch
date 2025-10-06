"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { PartyPopper } from "lucide-react"

export default function FamilyGoalModal({ goalName, xp, onClose }:{
  goalName?: string; xp: number; onClose: () => void
}) {
  return (
    <Dialog open onOpenChange={(o)=>!o && onClose()}>
      <DialogContent className="max-w-md bg-zinc-900 text-white border-zinc-800">
        <DialogHeader className="sr-only">
          <DialogTitle>Meta da Família Concluída!</DialogTitle>
        </DialogHeader>
        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-center">
            <PartyPopper className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <div className="text-xs uppercase opacity-70">Meta da Família Concluída!</div>
            <div className="mt-1 text-2xl font-bold">{goalName ?? "Meta"}</div>
            <div className="mt-4 text-sm bg-zinc-800 p-3 rounded-lg">
              Recompensa: <b className="text-amber-300">+{xp} XP para a família!</b>
            </div>

            <button
              className="mt-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20 transition-colors"
              onClick={onClose}
            >
              Comemorar!
            </button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
