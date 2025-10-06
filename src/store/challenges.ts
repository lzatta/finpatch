import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { useProfileStore } from "@/store/profile"

export type ChallengeStatus = "active" | "completed" | "expired"
export type ChallengeMode   = "manual" | "auto"
export type ChallengeUnit   = "count" | "amount" // contagem ou valor em R$
export type ChallengeFreq   = "weekly" | "oneoff"
export type ChallengeTrigger = "goal_contribution" | "tx_categorized_all" | null

export type Challenge = {
  id: string
  title: string
  description: string
  xp: number
  mode: ChallengeMode
  unit: ChallengeUnit
  target: number
  progress: number
  frequency: ChallengeFreq
  trigger: ChallengeTrigger
  startDate?: string
  dueDate?: string
  periodKey?: string
  createdAt: string
  xpAwarded?: boolean
  xpAwardedKey?: string
  completedAt?: string
}

type ChallengesState = {
  items: Challenge[]
  seedDefaults: () => void
  registerProgress: (id: string, delta?: number) => void
  registerAutoEvent: (trigger: ChallengeTrigger, value: number) => void
  resetWeeklyIfNeeded: () => void
  listActive: () => Challenge[]
  listCompleted: () => Challenge[]
  listExpired: () => Challenge[]
}

function weekKey(d = new Date()) {
  const dt = new Date(d)
  const year = dt.getUTCFullYear()
  const onejan = new Date(Date.UTC(year, 0, 1))
  const day = Math.floor((dt.getTime() - onejan.getTime()) / 86400000) + onejan.getUTCDay()
  const week = Math.ceil(day / 7)
  return `${year}-W${String(week).padStart(2, "0")}`
}

function isExpired(c: Challenge) {
  if (c.frequency === "weekly") return false
  if (!c.dueDate) return false
  const due = new Date(c.dueDate).getTime()
  return Date.now() > due && c.progress < c.target
}

export const useChallengesStore = create<ChallengesState>()(
  persist(
    (set, get) => {
      function awardIfCompleted(c: Challenge): Challenge {
        const now = new Date().toISOString()
        const pk = weekKey()
        const reached = c.progress >= c.target
        if (!reached) return c

        if (c.frequency === "weekly") {
          if (c.xpAwardedKey === c.periodKey) return c
          useProfileStore.getState().addXP(c.xp)
          if (c.id === "semana-sem-ifood") {
            useProfileStore.getState().grantBadge("frugal-week")
          }
          return { ...c, xpAwardedKey: c.periodKey ?? pk, completedAt: now }
        }

        if (c.xpAwarded) return c
        useProfileStore.getState().addXP(c.xp)
        return { ...c, xpAwarded: true, completedAt: now }
      }

      return {
        items: [],

        seedDefaults: () => {
          const now = new Date().toISOString()
          const pk = weekKey()
          set({
            items: [
              {
                id: "semana-sem-ifood",
                title: "Semana sem iFood",
                description: "Cozinhe em casa e economize.",
                xp: 150,
                mode: "manual",
                unit: "count",
                target: 7,
                progress: 0,
                frequency: "weekly",
                trigger: null,
                periodKey: pk,
                createdAt: now,
              },
              {
                id: "aporte-extra-100",
                title: "Aporte Extra",
                description: "Aporte R$ 100 em uma de suas metas.",
                xp: 100,
                mode: "auto",
                unit: "amount",
                target: 100,
                progress: 0,
                frequency: "weekly",
                trigger: "goal_contribution",
                periodKey: pk,
                createdAt: now,
              },
              {
                id: "revisao-orcamento",
                title: "Revisão de Orçamento",
                description: "Categorize todas as transações da semana.",
                xp: 200,
                mode: "manual",
                unit: "count",
                target: 1,
                progress: 0,
                frequency: "weekly",
                trigger: null,
                periodKey: pk,
                createdAt: now,
              },
            ],
          })
        },

        resetWeeklyIfNeeded: () => {
          const pk = weekKey()
          const items = get().items.map(c =>
            c.frequency === "weekly" && c.periodKey !== pk
              ? { ...c, progress: 0, periodKey: pk }
              : c
          )
          set({ items })
        },

        registerProgress: (id, delta = 1) => {
          const items = get().items.map(c => {
            if (c.id !== id) return c
            const nextProgress = Math.min(c.target, c.progress + delta)
            return awardIfCompleted({ ...c, progress: nextProgress })
          })
          set({ items })
        },

        registerAutoEvent: (trigger, value) => {
          if (!trigger) return
          const items = get().items.map(c => {
            if (c.trigger !== trigger) return c
            const add = c.unit === "amount" ? Math.max(0, value) : 1
            const nextProgress = Math.min(c.target, c.progress + add)
            return awardIfCompleted({ ...c, progress: nextProgress })
          })
          set({ items })
        },

        listActive: () => {
          const pk = weekKey()
          return get().items.filter(c => {
            if (c.frequency === "weekly" && c.periodKey !== pk) return true
            if (isExpired(c)) return false
            return c.progress < c.target
          })
        },

        listCompleted: () =>
          get().items.filter(c => c.progress >= c.target),

        listExpired: () =>
          get().items.filter(c => isExpired(c)),
      }
    },
    {
      name: "finpatch/challenges",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
