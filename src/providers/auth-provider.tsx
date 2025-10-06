import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  createProfileIfMissing,
  getProfile,
  updatePlan,
  type Profile,
  type PlanType,
} from "@/lib/user-data";
import { ensureResult } from "@/lib/safe";

type AuthCtx = {
  user: { id: string; email: string | null } | null;
  profile: Profile | null;
  loading: boolean;

  // API nova
  signInEmailPassword: (email: string, password: string) => Promise<void>;
  signUpEmailPassword: (fullName: string, email: string, password: string) => Promise<void>;
  setUserPlan: (plan: PlanType) => Promise<void>;

  // Aliases de compatibilidade (legado)
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  setPlan: (plan: PlanType) => Promise<void>;

  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

function withTimeout<T>(p: Promise<T>, ms = 4000): Promise<T> {
  return Promise.race([
    p,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("getSession timeout")), ms)
    ),
  ]) as Promise<T>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthCtx["user"]>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function boot() {
      setLoading(true);
      try {
        const { data } = await withTimeout(supabase.auth.getSession(), 4000);
        const s = data?.session ?? null;
        if (s?.user) {
          const u = { id: s.user.id, email: s.user.email ?? null };
          if (!ignore) setUser(u);
          try {
            const p = (await getProfile(u.id)) ?? (await createProfileIfMissing(u.id));
            if (!ignore) setProfile(p);
          } catch {
            if (!ignore) setProfile(null);
          }
        } else {
          if (!ignore) { setUser(null); setProfile(null); }
        }
      } catch (err) {
        if (!ignore) { setUser(null); setProfile(null); }
        console.warn("[Auth boot] getSession falhou/timeout:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    boot();

    const { data: sub } = ensureResult(supabase.auth.onAuthStateChange(async (_evt, s) => {
      if (s?.user) {
        const u = { id: s.user.id, email: s.user.email ?? null };
        setUser(u);
        const p = (await getProfile(u.id)) ?? (await createProfileIfMissing(u.id));
        setProfile(p);
      } else {
        setUser(null);
        setProfile(null);
      }
    }));

    return () => {
      sub?.subscription?.unsubscribe?.();
      ignore = true;
    };
  }, []);

  async function refreshProfile() {
    if (!user) return;
    const p = await getProfile(user.id);
    if (p) setProfile(p);
  }

  // -------- API nova --------
  async function signInEmailPassword(email: string, password: string) {
    const { error } = ensureResult(await supabase.auth.signInWithPassword({ email, password }));
    if (error) throw error;
    await refreshProfile();
  }

  async function signUpEmailPassword(fullName: string, email: string, password: string) {
    const { data, error } = ensureResult(await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } }));
    if (error) throw error;
    if (data.user) {
      await createProfileIfMissing(data.user.id, fullName);
      await refreshProfile();
    }
  }

  async function setUserPlan(plan: PlanType) {
    if (!user) throw new Error("No user");
    await updatePlan(user.id, plan);
    await refreshProfile();
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  // -------- Aliases (legado) --------
  const signIn = (email: string, password: string) => signInEmailPassword(email, password);
  const signUp = (fullName: string, email: string, password: string) =>
    signUpEmailPassword(fullName, email, password);
  const setPlan = (plan: PlanType) => setUserPlan(plan);

  const value: AuthCtx = useMemo(
    () => ({
      user,
      profile,
      loading,

      // nova
      signInEmailPassword,
      signUpEmailPassword,
      setUserPlan,

      // legado
      signIn,
      signUp,
      setPlan,

      signOut,
      refreshProfile,
    }),
    [user, profile, loading]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
