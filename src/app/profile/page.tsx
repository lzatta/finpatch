import PageTransition from "@/components/shared/page-transition";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileAchievements } from "@/components/profile/profile-achievements";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { ProfileStats } from "@/components/profile/profile-stats";
import { User, Plus, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profile";
import { hasFeature, PlanId } from "@/lib/plan";
import UpgradeHero from "@/components/billing/upgrade-hero";
import { useAuth } from "@/providers/auth-provider";

export default function ProfilePage() {
  const { addXP, grantBadge } = useProfileStore();
  const { profile } = useAuth();
  const plan = (profile?.plan ?? "free") as PlanId;
  const showUpgrade = !hasFeature(plan, 'ai_insights');

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          icon={User}
          title="Meu Perfil"
          description="Acompanhe seu progresso e personalize sua experiência."
        />
        <ProfileHeader />

        {/* Admin Debug Buttons */}
        {profile?.role === 'admin' && (
          <Card>
            <CardContent className="p-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => addXP(100)}>
                <Plus className="mr-2 h-4 w-4" /> Simular +100 XP
              </Button>
              <Button size="sm" variant="outline" onClick={() => grantBadge('frugal-week')}>
                <Award className="mr-2 h-4 w-4" /> Desbloquear Badge
              </Button>
            </CardContent>
          </Card>
        )}

        <ProfileStats />
        <ProfileAchievements />
        <div className="grid md:grid-cols-1 gap-6">
          <ProfileSettings />
          {showUpgrade && <UpgradeHero />}
        </div>
      </div>
    </PageTransition>
  );
}
