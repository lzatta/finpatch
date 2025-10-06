"use client";
import { useAuth } from "@/providers/auth-provider";

export default function FamilyPage(){
  const { loading, profile } = useAuth();

  if (loading) return <main className="p-6">Carregando…</main>;

  const plan = (profile?.plan ?? "basic") as 'basic'|'premium'|'family';
  if (plan !== "family"){
    return (
      <main className="p-6">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-1">Recurso Família</h2>
          <p className="text-sm text-muted-foreground">
            Este recurso está disponível apenas para o plano <b>Família</b>.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Família</h1>
      <p className="text-sm text-muted-foreground">Nenhum membro ainda. Convide alguém para começar.</p>
    </main>
  );
}
