"use client";
import DashboardHeader from "@/components/dashboard/header";
import EmptyDashboard from "@/components/dashboard/empty-dashboard";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardPage(){
  const { loading, profile } = useAuth();

  if (loading) {
    return (
      <main className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </main>
    );
  }

  // NULL-SAFE: perfil pode ser null em edge-cases, tratar como basic
  const plan = (profile?.plan ?? "basic") as 'basic'|'premium'|'family';

  return (
    <main className="p-6 space-y-6">
      <DashboardHeader />
      {/* Zero-state para contas novas (sem dados). Ao integrar com stores, troque a condição. */}
      <EmptyDashboard />
      {/* Removido card gigante de upgrade; fica apenas o chip do header */}
    </main>
  );
}
