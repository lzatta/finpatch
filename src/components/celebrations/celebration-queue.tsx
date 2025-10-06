"use client"
import * as React from "react"
import { useProfileStore } from "@/store/profile"
import LevelUpModal from "./level-up-modal"
import BadgeUnlockedModal from "./badge-unlocked-modal"

export default function CelebrationQueue() {
  const celebrations = useProfileStore(s => s.celebrations)
  const dequeue = useProfileStore(s => s.dequeue)
  const setSettings = useProfileStore(s => s.setSettings)
  const current = celebrations[0] || null

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setSettings({ animations: false, sfx: false });
    }
    const handleChange = (e: MediaQueryListEvent) => {
      setSettings({ animations: !e.matches, sfx: !e.matches });
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setSettings]);

  if (!current) return null

  if (current.kind === "level") {
    return <LevelUpModal from={current.from} to={current.to} onClose={dequeue} />
  }
  return <BadgeUnlockedModal badgeId={current.badgeId} onClose={dequeue} />
}
