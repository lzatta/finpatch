"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Flame, Star } from "lucide-react";
import { useProfileStore } from "@/store/profile";

export function ChallengesSummary() {
  const { xp, level, getLevelInfo } = useProfileStore();
  const info = getLevelInfo();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nível Atual</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Nível {level}</div>
          <p className="text-xs text-muted-foreground">{info.currentInLevel} / {info.nextLevelNeed} XP para o próximo nível</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sequência</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5 dias</div>
          <p className="text-xs text-muted-foreground">Continue assim! (mock)</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pontos Totais (XP)</CardTitle>
          <Star className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{xp}</div>
          <p className="text-xs text-muted-foreground">XP acumulado</p>
        </CardContent>
      </Card>
    </div>
  );
}
