// Runs a data loader and captures failures instead of throwing, so one broken
// data source (e.g. Supabase not configured yet) doesn't take down the whole
// dashboard. Widgets show a friendly message instead.
export async function safely<T>(load: () => Promise<T>): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    return { data: await load(), error: null };
  } catch (error) {
    // Re-throw Next.js internal signals (e.g. prerender bail-outs) untouched
    if (error && typeof error === "object" && "digest" in error) throw error;
    const message = error instanceof Error ? error.message : String(error);
    console.error("[dashboard]", message);
    return { data: null, error: message };
  }
}
