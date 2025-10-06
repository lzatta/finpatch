import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type Alert = {
  id: string
  title: string
  description: string
  severity: "crítico" | "aviso" | "info" | "sucesso"
  kind: "spend_spike" | "bill_due" | "goal_progress" | string
  category?: string // ex.: "Lazer", "Mercado"
  createdAt: string
}

type AlertsState = {
  items: Alert[]
  dismiss: (id: string) => void
  seed: () => void
}

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set, get) => ({
      items: [],
      dismiss: (id) => set({ items: get().items.filter(a => a.id !== id) }),
      seed: () => {
        if (get().items.length === 0) {
            set({
                items: [
                  { id: "a1", title: "Gasto excessivo em Lazer", description: "Você gastou 80% a mais que a média.", severity: "crítico", kind: "spend_spike", category: "Lazer", createdAt: new Date().toISOString() },
                  { id: "a2", title: "Fatura do cartão próxima", description: "Sua fatura de R$ 1.250,80 vence em 3 dias.", severity: "aviso", kind: "bill_due", createdAt: new Date().toISOString() },
                  { id: "a3", title: 'Meta "Viagem" progredindo', description: "Você alcançou 75% da sua meta. Continue assim!", severity: "info", kind: "goal_progress", createdAt: new Date().toISOString() },
                  { id: "a4", title: "Desafio de economia concluído!", description: "Você economizou R$ 200 esta semana.", severity: "sucesso", kind: "challenge_completed", createdAt: new Date().toISOString() },
                ]
            })
        }
      }
    }),
    {
      name: "finpatch/alerts",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
