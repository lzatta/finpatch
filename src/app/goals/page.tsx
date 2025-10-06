import React, { useEffect, useMemo, useState } from "react";
import PageTransition from "@/components/shared/page-transition";
import { useAuth } from "@/providers/auth-provider";
import { useGoalsStore, selectGoalsArray } from "@/store/goals";

function EmptyGoals() {
  return (
    <div className="p-6 text-center text-muted-foreground">
      Nenhuma meta cadastrada ainda.
    </div>
  );
}

export default function GoalsPage() {
  const { user } = useAuth();

  // SEMPRE retorna array
  const goals = useGoalsStore(selectGoalsArray);
  const loading = useGoalsStore((s) => s.loading);
  const fetchGoals = useGoalsStore((s) => s.fetch);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Carrega metas ao ter user.id
  useEffect(() => {
    if (user?.id) fetchGoals(user.id);
  }, [user?.id, fetchGoals]);

  // Mantém seleção consistente com a lista
  useEffect(() => {
    if (!goals.length) {
      setSelectedId(null);
      return;
    }
    if (selectedId && !goals.find((g) => g.id === selectedId)) {
      setSelectedId(goals[0].id);
    }
    if (!selectedId) {
      setSelectedId(goals[0].id);
    }
  }, [goals, selectedId]);

  const selectedGoal = useMemo(
    () => (selectedId ? goals.find((g) => g.id === selectedId) ?? null : null),
    [goals, selectedId]
  );

  if (loading) {
    return (
      <PageTransition>
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Carregando…</div>
        </div>
      </PageTransition>
    );
  }

  if (!goals.length) {
    return (
      <PageTransition>
        <EmptyGoals />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Metas</h1>
          {/* Aqui pode ir o botão de Nova Meta etc. */}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            {goals.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedId(g.id)}
                className={`w-full text-left rounded border p-3 ${
                  selectedId === g.id ? "border-primary" : "border-muted"
                }`}
              >
                <div className="font-medium">{g.name}</div>
                <div className="text-sm text-muted-foreground">
                  {g.current} / {g.target}
                </div>
              </button>
            ))}
          </div>

          <div className="rounded border p-3">
            {selectedGoal ? (
              <>
                <div className="font-semibold mb-2">{selectedGoal.name}</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Progresso: {selectedGoal.current} / {selectedGoal.target}
                </div>
                {/* Coloque aqui os controles de edição/atualização se já existirem */}
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                Selecione uma meta para ver os detalhes.
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
