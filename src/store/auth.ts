import { create } from "zustand";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  plan: "basic" | "premium" | "family";
  role: "user" | "admin";
  xp: number;
  level: number;
  frame?: string | null;
  background?: string | null;
  family_id?: string | null;
};

type AuthState = {
  loading: boolean;
  user: any | null;
  profile: Profile | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  loading: true,
  user: null,
  profile: null,

  refresh: async () => {
    set({ loading: true });
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;

    let profile: Profile | null = null;
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      profile = (data as Profile) ?? null;
    }

    set({ user, profile, loading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
}));

// Inicializa estado a partir da sessão atual
useAuthStore.getState().refresh();

// Mantém o store sincronizado com mudanças de auth
supabase.auth.onAuthStateChange(async () => {
  await useAuthStore.getState().refresh();
});

// Helpers usados por outros módulos (ex.: stores de metas/transações)
export const selectUserId = () => useAuthStore.getState().user?.id ?? null;
export const selectProfile = () => useAuthStore.getState().profile;
