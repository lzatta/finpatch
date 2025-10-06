"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"

export default function FamilyLevelUpModal({ from, to, onClose }:{
  from: number; to: number; onClose: () => void
}) {
  return (
    <Dialog open onOpenChange={(o)=>!o && onClose()}>
      <DialogContent className="max-w-md overflow-hidden p-0 bg-gradient-to-b from-emerald-600 to-teal-700 text-white border-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Level Up da Família!</DialogTitle>
        </DialogHeader>
        <div className="p-6 text-center">
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120 }}>
            <div className="text-sm opacity-90">Nível da Família</div>
            <div className="text-5xl font-black">{to}</div>
            <div className="mt-1 text-xs opacity-80">de {from} → {to}</div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
            <p className="mt-4 text-base">
              Parabéns! Sua família subiu de nível.
            </p>
            <button
              className="mt-6 inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm hover:bg-white/25 transition-colors"
              onClick={onClose}
            >
              Continuar
            </button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
