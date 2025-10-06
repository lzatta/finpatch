import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockFamilyMembers } from "@/lib/mock-data";
import { MoreVertical, Shield, User, Trash2, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { toast } from "sonner";

export function MemberManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Membros</CardTitle>
        <CardDescription>Gerencie os membros e suas permissões.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {mockFamilyMembers.map(member => (
            <div key={member.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{member.name} {member.isCurrentUser && "(Você)"}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'} className="text-xs">
                      {member.role === 'Admin' ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                      {member.role}
                    </Badge>
                    <Badge variant="outline">{member.xp} XP</Badge>
                  </div>
                </div>
              </div>
              
              {!member.isCurrentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {member.role === 'Membro' && <DropdownMenuItem onClick={() => toast.success(`${member.name} foi promovido a Admin.`)}><Shield className="mr-2 h-4 w-4" /> Promover a Admin</DropdownMenuItem>}
                    <DropdownMenuItem onClick={() => toast(`Lembrete enviado para ${member.name}.`)}><Bell className="mr-2 h-4 w-4" /> Enviar Lembrete</DropdownMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Remover
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Remover {member.name}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                Esta ação não pode ser desfeita. O membro será removido da família e perderá acesso aos dados compartilhados.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => toast.error(`${member.name} foi removido.`)} className="bg-destructive hover:bg-destructive/90">Confirmar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
