import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Reuse one client across hot reloads in dev.
const globalForDb = globalThis as unknown as { __supabase?: SupabaseClient };

/**
 * Server-only Supabase client using a **secret key** (`sb_secret_…`), from
 * Supabase's API key system that replaces the legacy JWT-based
 * anon/service_role keys.
 *
 * Secret keys bypass row-level security, so they must never reach a browser:
 * the "server-only" import above makes the build fail if a client component
 * ever imports this file. There's no login on this dashboard, so every
 * read/write happens here on the server.
 *
 * The publishable key (`sb_publishable_…`) is the browser-safe counterpart.
 * The app doesn't need it today, because RLS (no policies) blocks it from
 * every table.
 */
export function getDb(): SupabaseClient {
  if (globalForDb.__supabase) return globalForDb.__supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    // Point people at the rename if their .env still uses the old name
    const legacy = process.env.SUPABASE_SERVICE_ROLE_KEY ? " (SUPABASE_SERVICE_ROLE_KEY is no longer used)" : "";
    throw new Error(`SUPABASE_URL and SUPABASE_SECRET_KEY must be set, see .env.example${legacy}`);
  }

  // Only accept the new-style secret key. A publishable key would be blocked
  // by RLS, and a legacy service_role JWT is being phased out, so fail loudly
  // with a clear message instead of confusing "permission denied" errors.
  if (!key.startsWith("sb_secret_")) {
    const kind = key.startsWith("sb_publishable_") ? "the publishable key" : "not a secret key (legacy JWT?)";
    throw new Error(`SUPABASE_SECRET_KEY is ${kind}; use a secret key (sb_secret_…) from Project Settings > API Keys`);
  }

  globalForDb.__supabase = createClient(url, key, {
    // No user sessions on the server: don't try to store or refresh auth tokens
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return globalForDb.__supabase;
}

/** Unwraps a Supabase response, turning errors into thrown exceptions. */
export function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(`Supabase: ${error.message}`);
  return data as T;
}
