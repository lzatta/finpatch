"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type Product = {
  id: string
  nome: string
  taxaAnual: number // ex.: 0.105 = 10,5% a.a.
  minimo: number    // valor mínimo de aplicação
  risco?: string
  tipo?: string
  dyAnual?: number  // opcional para FII
}

function toBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}
function rateMonthly(a: number) {
  return Math.pow(1 + a, 1/12) - 1
}

export default function InvestmentSimulatorDialog({
  open,
  onOpenChange,
  produto,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  produto: Product | null
}) {
  const [inicial, setInicial] = React.useState<number>(produto?.minimo ?? 0)
  const [aporte, setAporte]   = React.useState<number>(0)
  const [prazo, setPrazo]     = React.useState<number>(12)
  const [taxaAa, setTaxaAa]   = React.useState<number>(produto?.taxaAnual ?? 0.1)

  // Recarrega os campos quando abre um produto novo
  React.useEffect(() => {
    if (!open) return
    setInicial(produto?.minimo ?? 0)
    setAporte(0)
    setPrazo(12)
    setTaxaAa(produto?.taxaAnual ?? 0.1)
  }, [open, produto?.id])

  const r = rateMonthly(taxaAa)
  const m = Math.max(1, prazo|0)
  const P = Math.max(0, Number(inicial) || 0)
  const A = Math.max(0, Number(aporte)  || 0)

  let fv: number
  if (r === 0) {
    fv = P + A * m
  } else {
    const fv0   = P * Math.pow(1 + r, m)
    const fvpmt = A > 0 ? A * ((Math.pow(1 + r, m) - 1) / r) : 0
    fv = fv0 + fvpmt
  }
  const investido = P + A * m
  const ganho     = Math.max(0, fv - investido)
  const invalido  = P < (produto?.minimo ?? 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Simular — {produto?.nome ?? "Investimento"}</DialogTitle>
        </DialogHeader>

        {!produto ? (
          <div className="text-sm text-muted-foreground">
            Selecione um produto para simular.
          </div>
        ) : (
          <div className="grid gap-3">
            <div>
              <Label>Investimento inicial (mín. {toBRL(produto.minimo)})</Label>
              <Input
                type="number"
                value={inicial}
                onChange={(e) => setInicial(Number(e.target.value) || 0)}
              />
              {invalido && (
                <p className="text-xs text-red-600 mt-1">Valor abaixo do mínimo.</p>
              )}
            </div>

            <div>
              <Label>Aporte mensal (opcional)</Label>
              <Input
                type="number"
                value={aporte}
                onChange={(e) => setAporte(Number(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label>Prazo (meses)</Label>
              <Input
                type="number"
                min={1}
                max={120}
                value={prazo}
                onChange={(e) => setPrazo(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>

            <div>
              <Label>Taxa anual (a.a.)</Label>
              <Input
                type="number"
                step="0.01"
                value={(taxaAa * 100).toFixed(2)}
                onChange={(e) => setTaxaAa((Number(e.target.value) || 0) / 100)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-2">
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">Valor futuro</div>
                <div className="text-lg font-semibold">{toBRL(fv)}</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">Total investido</div>
                <div className="text-lg font-semibold">{toBRL(investido)}</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">Ganho</div>
                <div className="text-lg font-semibold">{toBRL(ganho)}</div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
