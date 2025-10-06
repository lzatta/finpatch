"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { BADGES_CATALOG, COSMETICS_CATALOG, useProfileStore } from "@/store/profile"
import { cn } from "@/lib/utils"

export default function BadgeUnlockedModal({ badgeId, onClose }:{
  badgeId: string; onClose: () => void
}) {
  const { settings } = useProfileStore();
  const badge = BADGES_CATALOG.find(b => b.id === badgeId)
  const reward = COSMETICS_CATALOG.find(c => c.id === badge?.reward)

  const ring = {
    "comum": "ring-slate-300",
    "raro": "ring-cyan-400",
    "épico": "ring-fuchsia-400",
    "lendário": "ring-amber-400",
    "oculto": "ring-violet-400",
  }[badge?.rarity || "comum"]

  React.useEffect(() => {
    if (settings.sfx) {
        try {
            const audio = new Audio("/sfx/levelup.mp3") // You might want a different sound
            audio.volume = 0.5
            audio.play().catch(()=>{})
        } catch(e) {
            console.warn("Could not play badge unlock sound effect.");
        }
    }
  }, [settings.sfx]);


  return (
    <Dialog open onOpenChange={(o)=>!o && onClose()}>
      <DialogContent className="max-w-md bg-zinc-900 text-white border-zinc-800">
        <DialogHeader className="sr-only">
          <DialogTitle>Conquista Desbloqueada: {badge?.title ?? "Conquista"}</DialogTitle>
        </DialogHeader>
        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-center">
            <div className="text-xs uppercase opacity-70">Conquista desbloqueada</div>
            <div className="mt-1 text-2xl font-bold">{badge?.title ?? "Conquista"}</div>
            <div className="mt-1 text-sm opacity-80">{badge?.description}</div>

            <div className={cn("mx-auto mt-5 h-24 w-24 rounded-full ring-4 flex items-center justify-center bg-zinc-800/70", ring)}>
              <span className="text-4xl">🏅</span>
            </div>

            {reward && (
              <div className="mt-4 text-sm bg-zinc-800 p-3 rounded-lg">
                Recompensa desbloqueada: <b className="text-amber-300">{reward.name}</b> ({reward.type})
              </div>
            )}

            <button
              className="mt-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20 transition-colors"
              onClick={onClose}
            >
              Equipe depois
            </button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
