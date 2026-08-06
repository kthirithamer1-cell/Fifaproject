import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Server-only key — NEVER prefixed with NEXT_PUBLIC_ to prevent browser bundling
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
// Browser-safe key with Row Level Security (RLS)
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

// Server-side client (for API routes) — uses server-only key
export function createServerSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

// Browser-side client (for client components) — uses anon key with RLS
export function createBrowserSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
