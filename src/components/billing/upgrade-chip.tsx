"use client";
import { memo } from "react";
import { Link } from "react-router-dom";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

function UpgradeChip() {
  let profile = null as ReturnType<typeof useAuth>["profile"] | null;
  let loading = false;
  try { const a = useAuth(); profile = a.profile; loading = a.loading; } catch { /* ignore */ }

  if (loading) return null;
  const isAdmin = Boolean(profile?.is_admin);
  if (isAdmin) return null;

  const plan = (profile?.plan ?? "basic") as 'basic' | 'premium' | 'family';
  const label = plan === "basic" ? "Fazer upgrade" : "Gerenciar plano";

  return (
    <Button asChild size="sm" variant="secondary" className="rounded-full gap-2">
      <Link to="/billing/plans"><Crown className="h-4 w-4" />{label}</Link>
    </Button>
  );
}
export default memo(UpgradeChip);
