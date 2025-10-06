import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockFamilyRanking } from "@/lib/mock-data";
import { Flame, Award } from "lucide-react";

export function ChallengesRanking() {
  const sortedRanking = [...mockFamilyRanking].sort((a, b) => b.xp - a.xp);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking da Família</CardTitle>
        <CardDescription>Veja quem está na liderança esta semana.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {sortedRanking.map((user, index) => (
            <li key={user.id} className={`flex items-center gap-4 p-2 rounded-lg ${user.isCurrentUser ? 'bg-primary/10' : ''}`}>
              <span className="font-bold text-lg w-6 text-center">{index + 1}</span>
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">Nível {user.level}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{user.xp} XP</p>
                {user.streak && <span className="text-xs text-muted-foreground flex items-center justify-end gap-1"><Flame className="h-3 w-3 text-orange-500" /> {user.streak} dias</span>}
              </div>
              {index < 3 && <Award className={`h-5 w-5 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-700'}`} />}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
