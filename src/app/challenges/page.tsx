import PageTransition from "@/components/shared/page-transition";
import { ChallengesRanking } from "@/components/challenges/challenges-ranking";
import { ChallengesSummary } from "@/components/challenges/challenges-summary";
import WeeklyChallenges from "@/components/challenges/weekly-challenges";
import { PageHeader } from "@/components/shared/page-header";
import { Trophy } from "lucide-react";

export default function ChallengesPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          icon={Trophy}
          title="Desafios"
          description="Ganhe XP, suba de nível e melhore suas finanças."
        />
        <ChallengesSummary />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WeeklyChallenges />
          </div>
          <div className="space-y-6">
            <ChallengesRanking />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
