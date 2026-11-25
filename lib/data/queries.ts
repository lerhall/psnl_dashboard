import "server-only";

import { connection } from "next/server";
import { getDb, unwrap } from "@/lib/db";
import type { AcademicItem, Alert, Reminder, Todo } from "@/lib/db/schema";

// All reads from Supabase go through here. Each one awaits connection() first
// so Next.js never bakes database rows into the static build; lists are always
// fetched live per request.

/** Open to-dos first (soonest due first, undated last), then completed ones. */
export async function getTodos({ includeCompleted = true } = {}): Promise<Todo[]> {
  await connection();
  let query = getDb()
    .from("todos")
    .select("*")
    .order("completed", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (!includeCompleted) query = query.eq("completed", false);
  return unwrap(await query);
}

/** Open reminders first, most important first. */
export async function getReminders({ includeCompleted = true } = {}): Promise<Reminder[]> {
  await connection();
  let query = getDb()
    .from("reminders")
    .select("*")
    .order("completed", { ascending: true })
    .order("importance", { ascending: false })
    .order("created_at", { ascending: false });
  if (!includeCompleted) query = query.eq("completed", false);
  return unwrap(await query);
}

/** Academic items ordered by when they happen / are due. */
export async function getAcademicItems({ includeCompleted = true } = {}): Promise<AcademicItem[]> {
  await connection();
  let query = getDb()
    .from("academic_items")
    .select("*")
    .order("completed", { ascending: true })
    .order("due_at", { ascending: true });
  if (!includeCompleted) query = query.eq("completed", false);
  return unwrap(await query);
}

/** Active (non-archived) alerts by default; dated ones first, soonest first. */
export async function getAlerts({ archived = false } = {}): Promise<Alert[]> {
  await connection();
  return unwrap(
    await getDb()
      .from("alerts")
      .select("*")
      .eq("archived", archived)
      .order("date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false }),
  );
}
