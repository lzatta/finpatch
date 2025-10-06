import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockFamilyActivityFeed } from "@/lib/mock-data";

export function FamilyActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feed de Atividades</CardTitle>
        <CardDescription>O que sua família tem feito</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockFamilyActivityFeed.map(activity => {
            const Icon = activity.icon;
            return (
              <li key={activity.id} className="flex items-start gap-3">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarImage src={activity.memberAvatar} />
                  <AvatarFallback>{activity.memberName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <p className="text-sm">
                    <span className="font-semibold">{activity.memberName}</span> {activity.action}.
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
                <Icon className="h-4 w-4 text-muted-foreground mt-1" />
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
