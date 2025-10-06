import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { mockFamilyMembers, mockFamilyAchievements } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Wallet, Award, Trophy } from "lucide-react";

export function FamilySummaryCards() {
  const totalIncome = 15750;
  const totalExpenses = 8420;
  const weeklyRanking = [...mockFamilyMembers].sort((a, b) => (b.weeklySavings ?? 0) - (a.weeklySavings ?? 0));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Balanço Familiar
          </CardTitle>
          <CardDescription>Consolidado de receitas e despesas do mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{formatCurrency(totalIncome - totalExpenses)}</div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center text-success">
              <TrendingUp className="h-4 w-4 mr-1" /> {formatCurrency(totalIncome)}
            </div>
            <div className="flex items-center text-destructive">
              <TrendingDown className="h-4 w-4 mr-1" /> {formatCurrency(totalExpenses)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Ranking da Semana
          </CardTitle>
          <CardDescription>Quem mais economizou</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {weeklyRanking.slice(0, 2).map((member, index) => (
            <div key={member.id} className="flex items-center gap-2 text-sm">
              {index === 0 && <Award className="h-4 w-4 text-yellow-500" />}
              {index === 1 && <span className="w-4 text-center text-muted-foreground font-bold">2</span>}
              <Avatar className="h-6 w-6">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium flex-grow">{member.name}</span>
              <span className="font-semibold text-success">{formatCurrency(member.weeklySavings ?? 0)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Conquistas Recentes
          </CardTitle>
          <CardDescription>Vitórias da família</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockFamilyAchievements.slice(0, 2).map((ach, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <ach.icon className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{ach.text}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
