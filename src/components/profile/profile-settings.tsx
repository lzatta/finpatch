"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useProfileStore } from "@/store/profile";
import AvatarCustomizer from "./avatar-customizer";

export function ProfileSettings() {
  const sfx = useProfileStore(s => s.settings.sfx);
  const animations = useProfileStore(s => s.settings.animations);
  const setSettings = useProfileStore(s => s.setSettings);
  const [isCustomizerOpen, setCustomizerOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
          <CardDescription>Personalize sua experiência no FinPatch.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Personalização</h4>
            <Button variant="outline" className="w-full" onClick={() => setCustomizerOpen(true)}>Personalizar Aparência</Button>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Celebrações</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><Label htmlFor="s-sfx">Sons</Label><Switch id="s-sfx" checked={sfx} onCheckedChange={(c) => setSettings({sfx: c})} /></div>
              <div className="flex items-center justify-between"><Label htmlFor="s-animations">Animações</Label><Switch id="s-animations" checked={animations} onCheckedChange={(c) => setSettings({animations: c})} /></div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Preferências</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="p-theme">Tema</Label>
                <Select defaultValue="system">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="p-currency">Moeda</Label>
                <Select defaultValue="BRL">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">BRL (R$)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Conta</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full" onClick={() => toast.success('Seus dados estão sendo exportados.')}>Exportar Dados</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">Excluir Conta</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados de nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-2">
                    <Label>Digite "EXCLUIR" para confirmar</Label>
                    <Input placeholder="EXCLUIR" />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => toast.error('Conta excluída.')}>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
      <AvatarCustomizer open={isCustomizerOpen} onOpenChange={setCustomizerOpen} />
    </>
  );
}
