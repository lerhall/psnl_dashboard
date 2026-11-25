import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { addDays } from "@/lib/dates";
import { expandIcs, type CalendarEvent } from "./expand";
import { mergeCalendars } from "./merge";

export type CalendarSource = { name: string; url: string; colorIndex: number };

/**
 * Reads the two Outlook calendar links from the environment (.env.local).
 * Calendars without a URL are simply skipped.
 */
export function getCalendarSources(): CalendarSource[] {
  return [1, 2]
    .map((n, i) => ({
      name: process.env[`OUTLOOK_CALENDAR_${n}_NAME`] || `Calendar ${n}`,
      // Outlook hands out webcal:// links; fetch() needs https://
      url: (process.env[`OUTLOOK_CALENDAR_${n}_URL`] ?? "").replace(/^webcal:\/\//i, "https://"),
      colorIndex: i,
    }))
    .filter((s) => s.url.length > 0);
}

/**
 * Downloads one calendar and expands it for the window starting `fromDay`.
 * Cached ~10 minutes per (calendar, day), see the "calendar" profile.
 */
async function getCalendarEvents(source: CalendarSource, fromDay: string, days: number): Promise<CalendarEvent[]> {
  "use cache";
  cacheLife("calendar");
  cacheTag("calendar");

  try {
    const res = await fetch(source.url, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ics = await res.text();
    // Start a day early so events that began yesterday and run into today are caught
    const from = new Date(`${addDays(fromDay, -1)}T00:00:00Z`);
    const to = new Date(`${addDays(fromDay, days + 1)}T00:00:00Z`);
    return expandIcs(ics, source.name, { from, to });
  } catch (error) {
    console.warn(`[calendar] ${source.name} failed:`, error instanceof Error ? error.message : error);
    return [];
  }
}

/** Both calendars merged into one sorted list, plus which sources are configured. */
export async function getMergedEvents(fromDay: string, days: number) {
  const sources = getCalendarSources();
  const lists = await Promise.all(sources.map((s) => getCalendarEvents(s, fromDay, days)));
  // Only keep events that actually touch the requested window
  const lastDay = addDays(fromDay, days - 1);
  const events = mergeCalendars(lists).filter((e) => e.endDay >= fromDay && e.startDay <= lastDay);
  return { sources, events };
}
