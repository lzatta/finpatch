"use client"
import { useEffect, useMemo, useState } from "react"
import { useChallengesStore } from "@/store/challenges"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

function pct(p: number, t: number) {
  return t > 0 ? Math.round((p / t) * 100) : 0
}

export default function WeeklyChallenges() {
  const seedDefaults = useChallengesStore(s => s.seedDefaults)
  const resetWeeklyIfNeeded = useChallengesStore(s => s.resetWeeklyIfNeeded)
  const listActive = useChallengesStore(s => s.listActive)
  const listCompleted = useChallengesStore(s => s.listCompleted)
  const listExpired = useChallengesStore(s => s.listExpired)
  const registerProgress = useChallengesStore(s => s.registerProgress)
  const allItems = useChallengesStore(s => s.items) // To trigger re-render

  const [tab, setTab] = useState<"ativos"|"concluidos"|"vencidos">("ativos")

  useEffect(() => {
    resetWeeklyIfNeeded()
    // if never populated, seed defaults
    if (useChallengesStore.getState().items.length === 0) {
      seedDefaults()
    }
  }, [resetWeeklyIfNeeded, seedDefaults])

  const ativos = useMemo(() => listActive(), [allItems, listActive])
  const concluidos = useMemo(() => listCompleted(), [allItems, listCompleted])
  const vencidos = useMemo(() => listExpired(), [allItems, listExpired])

  const renderList = (arr: ReturnType<typeof listActive>) => (
    <div className="space-y-4">
      {arr.map(ch => {
        const progressPct = pct(ch.progress, ch.target)
        const isCompleted = ch.progress >= ch.target
        const isManual = ch.mode === "manual"

        return (
          <Card key={ch.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">{ch.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{ch.description}</p>
              </div>
              <div className="text-xs rounded-full px-2 py-1 bg-muted"> {ch.xp} XP </div>
            </CardHeader>
            <CardContent>
              <Progress value={progressPct} className="h-2" />
              <div className="mt-2 text-xs text-muted-foreground">
                {ch.unit === "amount"
                  ? `${progressPct}% — ${formatCurrency(ch.progress)} / ${formatCurrency(ch.target)}`
                  : `${progressPct}% — ${ch.progress} / ${ch.target}`}
              </div>

              <div className="mt-3 flex justify-end">
                {isManual ? (
                  <Button
                    size="sm"
                    disabled={isCompleted}
                    onClick={() => {
                      const before = ch.progress
                      registerProgress(ch.id, 1)
                      const after = Math.min(ch.target, before + 1)
                      if (before < ch.target && after >= ch.target) {
                        toast.success(`Desafio concluído! +${ch.xp} XP`)
                      } else {
                        toast.success("Progresso registrado")
                      }
                    }}
                  >
                    {isCompleted ? 'Concluído' : 'Registrar Progresso'}
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" disabled>
                    {isCompleted ? 'Concluído' : 'Automático'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
      {!arr.length && <div className="text-sm text-muted-foreground p-4 text-center">Nada por aqui.</div>}
    </div>
  )

  return (
    <Tabs value={tab} onValueChange={(v:any)=>setTab(v)} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="ativos">Ativos</TabsTrigger>
        <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
        <TabsTrigger value="vencidos">Vencidos</TabsTrigger>
      </TabsList>

      <TabsContent value="ativos">{renderList(ativos)}</TabsContent>
      <TabsContent value="concluidos">{renderList(concluidos)}</TabsContent>
      <TabsContent value="vencidos">{renderList(vencidos)}</TabsContent>
    </Tabs>
  )
}
