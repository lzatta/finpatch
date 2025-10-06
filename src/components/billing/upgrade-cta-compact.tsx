"use client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

type Props = {
  className?: string;
  buttonText?: string;
};

export default function UpgradeCTACompact({
  className = "",
  buttonText = "Fazer upgrade",
}: Props) {
  const nav = useNavigate();
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-3
      bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-900 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-purple-600 text-white">
          <Crown className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold">Desbloqueie o Premium</div>
          <div className="text-xs text-muted-foreground">
            7 dias grátis • R$ 19,90/mês
          </div>
        </div>
      </div>
      <Button size="sm" onClick={() => nav("/onboarding/plans")}>
        {buttonText}
      </Button>
    </div>
  );
}
