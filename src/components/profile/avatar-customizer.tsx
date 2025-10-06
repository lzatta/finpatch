"use client"
import { useProfileStore, COSMETICS_CATALOG, type CosmeticType } from "@/store/profile"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useShallow } from "zustand/react/shallow"

export default function AvatarCustomizer({ open, onOpenChange }:{ open: boolean; onOpenChange:(v:boolean)=>void }) {
  const { inventory, equipped } = useProfileStore(useShallow(s => ({ inventory: s.inventory, equipped: s.equipped })));
  const equip = useProfileStore(s => s.equip)

  const sections: CosmeticType[] = ["avatarSkin","frame","background","effect"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Personalizar Aparência</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto p-1">
          {sections.map(type => {
            const owned = COSMETICS_CATALOG.filter(c => c.type === type && inventory[type].includes(c.id))
            return (
              <div key={type}>
                <div className="mb-2 text-sm font-medium capitalize">{type.replace('avatarSkin', 'Avatar')}</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {owned.map(c => (
                    <button
                      key={c.id}
                      onClick={()=>equip(type, c.id)}
                      className={cn(
                        "rounded-lg border p-3 text-left transition-all",
                        equipped[type]===c.id ? "border-primary ring-2 ring-primary/50" : "hover:bg-accent"
                      )}
                    >
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs opacity-60 capitalize">{c.rarity}</div>
                    </button>
                  ))}
                  {owned.length === 0 && <div className="text-xs text-muted-foreground col-span-3">Nada desbloqueado ainda.</div>}
                </div>
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button onClick={()=>onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
