"use client";
import { Button } from "@/components/ui/button";
import { Users, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FamilyUpgradeGate() {
  const nav = useNavigate();
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-purple-50 to-indigo-50 p-6 dark:from-zinc-900 dark:to-zinc-900">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-purple-600 text-white">
          <Users className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-purple-600" />
            <h3 className="text-base font-semibold">Recurso do Plano Família</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            A funcionalidade de Família é exclusiva do Plano Família.
          </p>
        </div>
        <Button onClick={() => nav("/onboarding/plans?family=true")}>
          Conhecer Plano Família
        </Button>
      </div>
    </div>
  );
}
