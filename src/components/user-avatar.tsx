"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProfileStore, COSMETICS_CATALOG } from "@/store/profile"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useAuth } from "@/providers/auth-provider"

export function UserAvatar({ className }: { className?: string }) {
  const { profile } = useAuth();
  const { equipped } = useProfileStore()
  
  const equippedFrame = COSMETICS_CATALOG.find(c => c.id === equipped.frame)
  const equippedSkin = COSMETICS_CATALOG.find(c => c.id === equipped.avatarSkin)

  const frameClass = {
    'frame-gold': 'border-yellow-400 border-4',
  }[equippedFrame?.id || '']

  const skinImage = {
    'skin-neon': 'https://i.pravatar.cc/150?u=neon',
    'skin-classic': profile?.avatar_url || 'https://github.com/shadcn.png',
  }[equippedSkin?.id || ''] || profile?.avatar_url || 'https://github.com/shadcn.png'

  return (
    <div className={cn("relative", className)}>
      <Avatar className={cn("relative h-full w-full", frameClass)}>
        <AvatarImage src={skinImage} alt={profile?.display_name || "User Avatar"} />
        <AvatarFallback>{profile?.display_name?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>

      {equipped.effect === 'fx-stardust' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-yellow-300"
              style={{
                top: `${50 + 45 * Math.sin(i * 36)}%`,
                left: `${50 + 45 * Math.cos(i * 36)}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
