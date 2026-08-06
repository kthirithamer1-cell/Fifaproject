import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  if (!url) {
    console.error("❌ CRITICAL: NEXT_PUBLIC_SUPABASE_URL is missing in Vercel environment variables!");
  }
  return url;
}

function getSupabaseKey(isServer = false): string {
  if (isServer) {
    return (
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      ""
    );
  }
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  );
}

// Server-side client (for API routes) — uses server-only key
export function createServerSupabase() {
  const url = getSupabaseUrl();
  const key = getSupabaseKey(true);

  if (!url || !key) {
    throw new Error("Supabase configuration missing. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY are set in Vercel Settings -> Environment Variables.");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// Browser-side client (for client components) — uses anon key with RLS
export function createBrowserSupabase() {
  const url = getSupabaseUrl();
  const key = getSupabaseKey(false);

  if (!url || !key) {
    throw new Error("Supabase configuration missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in Vercel Settings -> Environment Variables.");
  }

  return createClient(url, key);
}
