import "server-only";

import { connection } from "next/server";
import { toISODate } from "./dates";

/**
 * Today's date ("YYYY-MM-DD") in the dashboard timezone, plus the current
 * instant. Awaits connection() so it's computed per request rather than
 * frozen at build time.
 */
export async function getToday() {
  await connection();
  const now = new Date();
  return { now, today: toISODate(now) };
}
