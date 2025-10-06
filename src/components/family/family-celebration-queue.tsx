"use client"
import { useFamilyStore, FAMILY_BADGES_CATALOG, FAMILY_COSMETICS_CATALOG } from "@/store/family"
import FamilyLevelUpModal from "./modals/family-levelup-modal"
import FamilyBadgeModal from "./modals/family-badge-modal"
import FamilyGoalModal from "./modals/family-goal-modal"

export default function FamilyCelebrationQueue() {
  const celebrations = useFamilyStore(s => s.celebrations)
  const dequeue = useFamilyStore(s => s.dequeue)
  const goals = useFamilyStore(s => s.goals)
  const current = celebrations[0] || null
  
  if (!current) return null

  if (current.kind === "family-level") {
    return <FamilyLevelUpModal from={current.from} to={current.to} onClose={dequeue} />
  }
  if (current.kind === "family-badge") {
    const badge = FAMILY_BADGES_CATALOG.find(b => b.id === current.badgeId)
    const reward = FAMILY_COSMETICS_CATALOG.find(c => c.id === badge?.reward)
    return <FamilyBadgeModal badge={badge} reward={reward} onClose={dequeue} />
  }
  if (current.kind === "family-goal") {
    const goal = goals.find(g => g.id === current.goalId)
    return <FamilyGoalModal goalName={goal?.title} xp={current.xp} onClose={dequeue} />
  }
  return null
}
