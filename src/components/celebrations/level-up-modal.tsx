"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { useProfileStore } from "@/store/profile"

let confetti: any = null
if (typeof window !== "undefined") {
  import("canvas-confetti").then(m => { confetti = m.default })
}

export default function LevelUpModal({ from, to, onClose }:{
  from: number; to: number; onClose: () => void
}) {
  const { settings } = useProfileStore()
  React.useEffect(() => {
    if (settings.animations && confetti) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
      confetti({ particleCount: 80, spread: 60, ticks: 200, scalar: 0.8 })
    }
    if (settings.sfx) {
      try {
        const audio = new Audio("/sfx/levelup.mp3")
        audio.volume = 0.6
        audio.play().catch(()=>{})
      } catch(e) {
        console.warn("Could not play level up sound effect.");
      }
    }
  }, [settings])

  return (
    <Dialog open onOpenChange={(o)=>!o && onClose()}>
      <DialogContent className="max-w-md overflow-hidden p-0 bg-gradient-to-b from-purple-600 to-indigo-700 text-white border-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Você subiu de nível!</DialogTitle>
        </DialogHeader>
        <div className="p-6 text-center">
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120 }}>
            <div className="text-sm opacity-90">Nível</div>
            <div className="text-5xl font-black">{to}</div>
            <div className="mt-1 text-xs opacity-80">de {from} → {to}</div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
            <p className="mt-4 text-base">
              Parabéns! Você subiu de nível.
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
