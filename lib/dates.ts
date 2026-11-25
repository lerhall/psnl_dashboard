// Date helpers. Everything is timezone-aware using DASHBOARD_TIMEZONE so the
// Pi's system clock setting doesn't matter. These are pure functions (they
// take "now" as an argument) so they're easy to test.

export const TIMEZONE = process.env.DASHBOARD_TIMEZONE ?? "Europe/London";

/** Returns the calendar date ("YYYY-MM-DD") of `date` in the dashboard timezone. */
export function toISODate(date: Date, timeZone = TIMEZONE): string {
  // en-CA formats dates as YYYY-MM-DD, which is exactly what we want
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Whole days from `fromISO` to `toISO` (both "YYYY-MM-DD"). Negative = in the past. */
export function daysBetween(fromISO: string, toISO: string): number {
  // Parse as UTC midnight so DST changes can't produce fractional days
  const from = Date.parse(`${fromISO.slice(0, 10)}T00:00:00Z`);
  const to = Date.parse(`${toISO.slice(0, 10)}T00:00:00Z`);
  return Math.round((to - from) / 86_400_000);
}

/** Adds `days` to a "YYYY-MM-DD" string. */
export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Human label for how far away a date is, e.g. "Today", "In 3 days", "2 days ago". */
export function relativeDayLabel(targetISO: string, todayISO: string): string {
  const diff = daysBetween(todayISO, targetISO);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1) return `In ${diff} days`;
  return `${-diff} days ago`;
}

/** Urgency bucket used to colour due dates. */
export type Urgency = "overdue" | "today" | "soon" | "later" | "none";

export function urgencyFor(targetISO: string | null, todayISO: string): Urgency {
  if (!targetISO) return "none";
  const diff = daysBetween(todayISO, targetISO);
  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  if (diff <= 3) return "soon";
  return "later";
}

/** "Mon 24 Nov" style label for a "YYYY-MM-DD" string. */
export function formatDay(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${iso.slice(0, 10)}T00:00:00Z`));
}

/** "14:30" style label for an instant, in the dashboard timezone. */
export function formatTime(date: Date | string, timeZone = TIMEZONE): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(typeof date === "string" ? new Date(date) : date);
}

/** "Mon 24 Nov, 14:30" for a local "YYYY-MM-DDTHH:mm" string (no timezone conversion). */
export function formatLocalDateTime(local: string): string {
  const time = local.length > 10 ? local.slice(11, 16) : "";
  return time ? `${formatDay(local)}, ${time}` : formatDay(local);
}

/** Short "3h ago" style label for news timestamps. */
export function timeAgo(date: Date | string, now: Date): string {
  const then = typeof date === "string" ? new Date(date) : date;
  const minutes = Math.round((now.getTime() - then.getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
