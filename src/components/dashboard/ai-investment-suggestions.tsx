"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import InvestmentSimulatorDialog, { Product } from "@/components/investments/investment-simulator-dialog";
import { formatCurrency } from "@/lib/utils";

const suggestions: (Omit<Product, 'taxaAnual'> & { reason: string; iaScore: number; returnLabel: string; taxaAnual: number })[] = [
  {
    id: "1",
    nome: "Tesouro Selic 2029",
    risco: "Baixo",
    taxaAnual: 0.105,
    returnLabel: "~10.5% a.a.",
    minimo: 140.00,
    reason: "Ideal para reserva de emergência com liquidez diária.",
    iaScore: 9.2,
    tipo: "tesouro",
  },
  {
    id: "2",
    nome: "FII MXRF11",
    risco: "Médio",
    taxaAnual: 0.12,
    returnLabel: "~12% a.a.",
    minimo: 10.50,
    reason: "Bom pagador de dividendos mensais e diversificado.",
    iaScore: 8.5,
    dyAnual: 0.12,
    tipo: "fii",
  },
];

export function AiInvestmentSuggestions() {
  const [simOpen, setSimOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  function handleSimular(produto: Product) {
    setSelected(produto);
    setSimOpen(true);
  }

  return (
    <>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Sugestões de Investimento
          </CardTitle>
          <CardDescription>Recomendações da IA baseadas no seu perfil.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestions.map(sug => (
            <div key={sug.id} className="p-4 border rounded-lg bg-accent/50">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                <div>
                  <p className="font-bold">{sug.nome}</p>
                  <p className="text-sm text-muted-foreground">{sug.reason}</p>
                </div>
                <Badge>IA Score: {sug.iaScore}</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Risco</p>
                  <p className="font-semibold text-sm">{sug.risco}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Retorno Estimado</p>
                  <p className="font-semibold text-sm">{sug.returnLabel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mínimo</p>
                  <p className="font-semibold text-sm">{formatCurrency(sug.minimo)}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={() => toast.success(`Investimento em ${sug.nome} simulado!`)}>Investir Agora</Button>
                <Button size="sm" variant="outline" onClick={() => handleSimular(sug)}>Simular</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <InvestmentSimulatorDialog 
        open={simOpen} 
        onOpenChange={setSimOpen} 
        produto={selected} 
      />
    </>
  );
}
