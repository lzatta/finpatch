import { supabase } from "./supabase";

export type PlanType = "basic" | "premium" | "family";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: PlanType;
  is_admin: boolean;
  xp: number;
  level: number;
  created_at?: string;
  updated_at?: string;
};

/** Busca o perfil; retorna null se não existir */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  // Em alguns ambientes, quando não encontra retorna erro PGRST116
  if (error && (error as any).code === "PGRST116") return null;
  if (error) throw error;
  return (data as unknown) as Profile;
}

/** Cria um perfil padrão se não existir e retorna o perfil */
export async function createProfileIfMissing(
  userId: string,
  fullName?: string
): Promise<Profile> {
  const existing = await getProfile(userId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      full_name: fullName ?? null,
      avatar_url: null,
      plan: "basic",     // novo usuário começa no plano básico
      is_admin: false,
      xp: 0,
      level: 1,
    })
    .select("*")
    .single();

  if (error) throw error;
  return (data as unknown) as Profile;
}

/** Atualiza o plano do usuário e retorna o perfil atualizado */
export async function updatePlan(
  userId: string,
  plan: PlanType
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ plan })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return (data as unknown) as Profile;
}
