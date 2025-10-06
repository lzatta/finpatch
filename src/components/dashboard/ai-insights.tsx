import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const insights = [
  {
    id: 1,
    icon: TrendingUp,
    title: "Oportunidade de Investimento",
    description: "Identificamos um CDB com rendimento de 115% do CDI e baixo risco.",
    priority: "info",
  },
  {
    id: 2,
    icon: AlertTriangle,
    title: "Anomalia de Gasto",
    description: "Sua assinatura da 'Streaming XYZ' aumentou 15%. Deseja revisar?",
    priority: "warn",
  },
];

export function AiInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          Insights da IA
        </CardTitle>
        <CardDescription>Oportunidades e anomalias detectadas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map(insight => {
            const Icon = insight.icon;
            return (
              <div key={insight.id} className="flex items-start gap-4">
                <Icon className="h-5 w-5 mt-1 text-primary" />
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{insight.title}</p>
                    <Badge variant={insight.priority as any}>{insight.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
