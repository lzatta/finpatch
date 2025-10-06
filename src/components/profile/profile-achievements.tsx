import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockAchievements } from "@/lib/mock-data";
import { Lock, Trophy } from "lucide-react";
import { ChallengeRarity } from "@/lib/types";

const rarityColors: Record<ChallengeRarity, string> = {
  common: "bg-gray-500/20 text-gray-500",
  uncommon: "bg-green-500/20 text-green-500",
  rare: "bg-blue-500/20 text-blue-500",
  epic: "bg-purple-500/20 text-purple-500",
  legendary: "bg-yellow-500/20 text-yellow-500",
};

export function ProfileAchievements() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conquistas</CardTitle>
        <CardDescription>Suas medalhas e progresso.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAchievements.map(ach => (
          <div key={ach.id} className={`p-4 border rounded-lg ${!ach.unlocked ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{ach.name}</h4>
              {ach.unlocked ? <Trophy className="h-5 w-5 text-yellow-500" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
            </div>
            <p className="text-xs text-muted-foreground mb-2">{ach.description}</p>
            <Badge className={rarityColors[ach.rarity]}>{ach.rarity}</Badge>
            {!ach.unlocked && ach.progress !== undefined && (
              <>
                <Progress value={ach.progress} className="h-1 mt-2" />
                <p className="text-xs text-right text-muted-foreground mt-1">{ach.progress}%</p>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
