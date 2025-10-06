"use client";
import UpgradeChip from "@/components/billing/upgrade-chip";
import { useAuth } from "@/providers/auth-provider";
import { LayoutDashboard } from "lucide-react";

export default function DashboardHeader(){
  const { loading, profile, user } = useAuth();
  const name = profile?.full_name || user?.email?.split("@")[0] || "Usuário";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm text-muted-foreground">Olá,</p>
          <h1 className="text-xl font-semibold leading-tight">{name}</h1>
        </div>
      </div>
      {!loading && <UpgradeChip />}
    </div>
  );
}
