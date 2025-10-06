"use client";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { PlanId } from '@/lib/plan';

type Feature = { label: string };
type PlanCardProps = {
  name: string;
  price: string;
  badge?: string;
  features: Feature[];
  cta: string;
  onSelect: () => void;
  highlight?: boolean;
};

function PlanCard({ name, price, badge, features, cta, onSelect, highlight }: PlanCardProps) {
  return (
    <Card className={`flex flex-col justify-between border-2 ${highlight ? "border-purple-500 shadow-lg shadow-purple-500/20" : "border-transparent"}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{name}</CardTitle>
          {badge && <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">{badge}</span>}
        </div>
        <CardDescription className="text-2xl font-bold">
          {price} <span className="text-sm font-normal text-muted-foreground">/ mês</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-emerald-500" />
            <span>{f.label}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={highlight ? 'premium' : 'default'} onClick={onSelect}>
          {cta}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function OnboardingPlansPage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function choose(plan: PlanId | 'trial_premium') {
    setErr(null);

    if (!user?.id) {
      toast.error("Você precisa estar logado para escolher um plano.");
      navigate('/login');
      return;
    }
    
    const finalPlan = plan === 'trial_premium' ? 'premium' : plan;

    setSubmitting(true);
    try {
      if (plan === "trial_premium") {
        localStorage.setItem("finpatch/trialEnds", String(Date.now() + 7 * 24 * 60 * 60 * 1000));
      }
      
      const { error } = await supabase.from('profiles').update({ plan: finalPlan }).eq('id', user.id);
      if (error) throw error;

      await refreshProfile();
      toast.success("Plano atualizado com sucesso!");
      navigate('/dashboard');
    } catch (e: any) {
      console.error('Failed to set plan', e);
      const message = e?.message ?? 'Não foi possível salvar o plano.';
      setErr(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
       {err && <p className="text-sm text-red-500 mb-4 bg-red-500/10 p-3 rounded-lg">{err}</p>}
      <div className="rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-fuchsia-600 p-[1px]">
        <div className="rounded-2xl bg-card p-8">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold">Escolha seu plano</h1>
            <p className="mt-2 text-muted-foreground">Planos justos para o seu momento. Você pode trocar quando quiser.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <PlanCard
              name="Basic"
              price="R$ 9,90"
              features={[
                { label: "Transações manuais" },
                { label: "Até 3 metas" },
                { label: "Gráficos básicos" },
                { label: "Orçamento mensal simples" },
                { label: "Histórico de 3 meses" },
              ]}
              cta="Ficar no Basic"
              onSelect={() => choose("basic")}
            />

            <PlanCard
              name="Premium"
              price="R$ 19,90"
              badge="Mais popular"
              highlight
              features={[
                { label: "Metas ilimitadas" },
                { label: "Insights e Alertas da IA" },
                { label: "Simulador financeiro" },
                { label: "Sugestões de investimento" },
                { label: "Open Finance + Exportações" },
                { label: "Histórico de 24 meses" },
                { label: "Desafios & Insígnias" },
              ]}
              cta="Assinar Premium"
              onSelect={() => choose("premium")}
            />

            <PlanCard
              name="Família"
              price="R$ 29,90"
              features={[
                { label: "Tudo do Premium" },
                { label: "Até 6 membros" },
                { label: "Metas compartilhadas" },
                { label: "XP/Nível e Ranking da Família" },
                { label: "Avatar/skins/efeitos da Família" },
                { label: "Notificações familiares" },
              ]}
              cta="Assinar Família"
              onSelect={() => choose("family")}
            />
          </div>

          <div className="mt-10 rounded-xl border bg-muted/40 p-6 text-center">
            <h3 className="text-lg font-semibold">Teste Premium por 7 dias</h3>
            <p className="mt-1 text-sm text-muted-foreground">Experimente tudo do Premium sem compromisso. Cancele quando quiser.</p>
            <Button className="mt-4" disabled={submitting} onClick={() => choose("trial_premium")}>
              Começar teste gratuito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
