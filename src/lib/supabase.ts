import { createClient } from "@supabase/supabase-js";

function clean(v?: unknown) {
  return (typeof v === "string" ? v : "")
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

declare global {
  interface Window {
    __SUPABASE__?: { url?: string; anonKey?: string };
  }
}

// 1) VITE env
const envUrl = clean(import.meta.env.VITE_SUPABASE_URL);
const envKey = clean(import.meta.env.VITE_SUPABASE_ANON_KEY);

// 2) window.__SUPABASE__ (definido no index.html)
const winUrl = typeof window !== "undefined" ? clean(window.__SUPABASE__?.url) : "";
const winKey = typeof window !== "undefined" ? clean(window.__SUPABASE__?.anonKey) : "";

const url = envUrl || winUrl;
const key = envKey || winKey;

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log("[SUPABASE SOURCES]", {
    using: url ? (envUrl ? "env" : (winUrl ? "window" : "hard")) : "missing",
    urlPreview: url || "MISSING",
    keyPreview: key ? key.slice(0, 8) + "..." : "MISSING",
  });
}

if (!url || !/^https?:\/\//.test(url)) {
  throw new Error(
    `[Supabase] URL ausente/inválida. Recebi: "${url || "EMPTY"}". 
Defina VITE_SUPABASE_URL no .env OU window.__SUPABASE__.url no index.html.`
  );
}
if (!key) {
  throw new Error(
    "[Supabase] Anon key ausente. Defina VITE_SUPABASE_ANON_KEY no .env OU window.__SUPABASE__.anonKey."
  );
}

export const supabase = createClient(url, key);
