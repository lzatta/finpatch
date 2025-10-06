import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProfileStore } from "@/store/profile";
import { Progress } from "../ui/progress";
import { UserAvatar } from "../user-avatar";
import { useAuth } from "@/providers/auth-provider";

export function ProfileHeader() {
  const { profile } = useAuth();
  const { getLevelInfo } = useProfileStore();
  const levelInfo = getLevelInfo();

  return (
    <Card>
      <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
        <UserAvatar className="h-24 w-24" />
        <div className="text-center sm:text-left flex-grow">
          <h2 className="text-2xl font-bold">{profile?.display_name || "Usuário"}</h2>
          <p className="text-muted-foreground">{profile?.email || "..."}</p>
          <div className="flex items-center gap-4 mt-4 justify-center sm:justify-start">
            <Badge variant="secondary" className="text-base">Nível {levelInfo.level}</Badge>
            <div className="w-full max-w-xs">
                <Progress value={levelInfo.progressPct} className="h-2" />
                <p className="text-xs text-muted-foreground text-right mt-1">{levelInfo.currentInLevel} / {levelInfo.nextLevelNeed} XP</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
