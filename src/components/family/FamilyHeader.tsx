import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function FamilyHeader() {
  const familyXP = 2340;
  const nextLevelXP = 3000;
  const progress = (familyXP / nextLevelXP) * 100;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Família Silva</h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="w-40">
            <Progress value={progress} className="h-2" />
          </div>
          <span className="text-sm text-muted-foreground">Nível 8: {familyXP}/{nextLevelXP} XP</span>
        </div>
        <div className="mt-2">
          <Badge variant="secondary" className="flex items-center gap-1.5">
            <Award className="h-3 w-3 text-yellow-500" />
            Conquista: Economia Coletiva
          </Badge>
        </div>
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Convidar Membro
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Convidar novo membro</DialogTitle>
            <DialogDescription>
              Envie um convite para alguém se juntar à sua família no FinPatch.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail do convidado</Label>
              <Input id="email" type="email" placeholder="nome@exemplo.com" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => toast.success("Convite enviado!")}>Enviar Convite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
