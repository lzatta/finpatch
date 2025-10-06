import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAlertsStore, Alert } from "@/store/alerts";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "../shared/empty-state";

const alertIcons: Record<Alert['severity'], React.ElementType> = {
  crítico: XCircle,
  aviso: AlertTriangle,
  info: Info,
  sucesso: CheckCircle,
};

const alertBadgeVariants: Record<Alert['severity'], "destructive" | "warning" | "info" | "success"> = {
    crítico: 'destructive',
    aviso: 'warning',
    info: 'info',
    sucesso: 'success',
};

const AlertAction = ({ alert }: { alert: Alert }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    toast.success("Redirecionando...");
  };

  if (alert.kind === 'spend_spike' && alert.category) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm">Revisar gastos</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revisar Gastos Excessivos</AlertDialogTitle>
            <AlertDialogDescription>
              Detectamos um aumento significativo nos seus gastos com {alert.category}. Vamos te levar para a tela de transações para você revisar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleNavigate(`/transactions?category=${alert.category}`)}>Confirmar Revisão</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (alert.kind === 'bill_due') {
    return <Button size="sm" onClick={() => toast("Função 'Pagar fatura' em breve.")}>Pagar fatura</Button>;
  }
  if (alert.kind === 'goal_progress') {
      return <Button size="sm" onClick={() => handleNavigate('/goals')}>Ver meta</Button>;
  }
  if (alert.kind === 'challenge_completed') {
    return <Button size="sm" onClick={() => handleNavigate('/challenges')}>Ver desafios</Button>;
  }

  return null;
}

export function SmartAlerts() {
  const { items: alerts, dismiss, seed } = useAlertsStore();

  useEffect(() => {
    seed();
  }, [seed]);

  const handleDismiss = (id: string) => {
    dismiss(id);
    toast.success('Alerta dispensado.');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alertas Inteligentes
        </CardTitle>
        <CardDescription>Avisos e sugestões gerados pela nossa IA.</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
            <div className="space-y-4">
            {alerts.map(alert => {
                const Icon = alertIcons[alert.severity];
                return (
                <div key={alert.id} className="flex items-start gap-4 p-3 rounded-lg bg-accent/50">
                    <Icon className={`h-5 w-5 mt-1 shrink-0 text-${alertBadgeVariants[alert.severity]}`} />
                    <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold">{alert.title}</p>
                        <Badge variant={alertBadgeVariants[alert.severity]}>{alert.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <div className="mt-2 flex gap-2">
                        <AlertAction alert={alert} />
                        <Button size="sm" variant="ghost" onClick={() => handleDismiss(alert.id)}>Dispensar</Button>
                    </div>
                    </div>
                </div>
                )
            })}
            </div>
        ) : (
            <EmptyState 
                icon={Bell}
                title="Tudo em ordem!"
                description="Você não tem novos alertas no momento. Bom trabalho!"
                className="border-none p-0"
            />
        )}
      </CardContent>
    </Card>
  )
}
