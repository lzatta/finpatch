import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAvailableChallenges } from "@/lib/mock-data";
import { toast } from "sonner";

export function AvailableChallenges() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desafios Disponíveis</CardTitle>
        <CardDescription>Escolha um novo desafio para começar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockAvailableChallenges.map(challenge => (
          <div key={challenge.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold">{challenge.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{challenge.xp} XP</Badge>
                <Badge variant={challenge.difficulty === 'Fácil' ? 'success' : challenge.difficulty === 'Médio' ? 'warning' : 'destructive'}>{challenge.difficulty}</Badge>
              </div>
            </div>
            <Button onClick={() => toast.success(`Você agora está participando de "${challenge.title}"!`)}>Participar</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
