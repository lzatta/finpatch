import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FileDown } from "lucide-react";
import { toast } from "sonner";

export function FamilySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Família</CardTitle>
        <CardDescription>Ajuste as preferências do grupo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="s-notifications" className="flex flex-col space-y-1">
              <span>Notificações</span>
              <span className="font-normal leading-snug text-muted-foreground text-xs">
                Receber alertas sobre atividades da família.
              </span>
            </Label>
            <Switch id="s-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="s-ranking" className="flex flex-col space-y-1">
              <span>Ranking Semanal</span>
              <span className="font-normal leading-snug text-muted-foreground text-xs">
                Exibir o ranking de economia.
              </span>
            </Label>
            <Switch id="s-ranking" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="s-gamification" className="flex flex-col space-y-1">
              <span>Modo Gamificado</span>
              <span className="font-normal leading-snug text-muted-foreground text-xs">
                Ativar conquistas e níveis visuais.
              </span>
            </Label>
            <Switch id="s-gamification" defaultChecked />
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={() => toast.success("Relatório familiar gerado!")}>
          <FileDown className="mr-2 h-4 w-4" />
          Exportar Relatório de Gastos
        </Button>
      </CardContent>
    </Card>
  );
}
