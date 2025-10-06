import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { toast } from "sonner";

const features = [
  "Insights IA ilimitados",
  "Metas compartilhadas em família",
  "Relatórios avançados",
  "Avatar e temas exclusivos",
  "Suporte prioritário",
];

export function PremiumPlan() {
  const handleUpgrade = (plan: string) => {
    toast.success(`Upgrade para o plano ${plan} realizado!`);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="premium" className="w-full">Fazer Upgrade para Premium</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Plano Premium FinPatch</DialogTitle>
          <DialogDescription>
            Desbloqueie todo o potencial da sua vida financeira.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <ul className="space-y-2">
            {features.map(feature => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            <Button variant="premium" onClick={() => handleUpgrade('Família')}>
              Plano Família - R$ 29,90/mês
            </Button>
            <Button variant="outline" onClick={() => handleUpgrade('Individual')}>
              Plano Individual - R$ 19,90/mês
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
