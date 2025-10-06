// src/lib/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function clean(v?: unknown) {
  return (typeof v === "string" ? v : "").trim().replace(/^['"]|['"]$/g, "");
}

declare global {
  interface Window {
    __SUPABASE__?: { url?: string; anonKey?: string };
    __sb?: SupabaseClient;
    __sbInfo?: { url: string; anonKeyMasked: string };
  }
}

// 1) .env (Vite)
const envUrl = clean(import.meta?.env?.VITE_SUPABASE_URL);
const envKey = clean(import.meta?.env?.VITE_SUPABASE_ANON_KEY);

// 2) Fallback: window.__SUPABASE__ (definido em index.html)
const winUrl =
  typeof window !== "undefined" ? clean(window.__SUPABASE__?.url) : "";
const winKey =
  typeof window !== "undefined" ? clean(window.__SUPABASE__?.anonKey) : "";

// 3) Escolhe a fonte disponível
const url = envUrl || winUrl;
const key = envKey || winKey;

if (!url) {
  throw new Error(
    "[Supabase] URL ausente. Defina VITE_SUPABASE_URL no .env OU window.__SUPABASE__.url no index.html."
  );
}
if (!key) {
  throw new Error(
    "[Supabase] Anon key ausente. Defina VITE_SUPABASE_ANON_KEY no .env OU window.__SUPABASE__.anonKey no index.html."
  );
}

export const supabase = createClient(url, key, {
  db: { schema: "public" },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // força persistência mesmo em sandbox/iframe
    storage:
      typeof window !== "undefined" && "localStorage" in window
        ? window.localStorage
        : undefined,
    storageKey: "finpatch.supabase.auth",
  },
  global: {
    headers: {
      "x-client-info": "finpatch/dualitev1",
    },
  },
});

// EXPÕE no window para testes no Console
if (typeof window !== "undefined") {
  window.__sb = supabase;
  window.__sbInfo = { url, anonKeyMasked: key.slice(0, 8) + "..." };
}

// Helpers
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token ?? null;
}
