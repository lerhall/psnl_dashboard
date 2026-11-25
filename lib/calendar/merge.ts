import { addDays } from "@/lib/dates";
import type { CalendarEvent } from "./expand";

// Pure functions for combining the two Outlook calendars into one agenda.

/**
 * Merges events from several calendars. If the same event shows up in both
 * (e.g. you were invited from one account to the other), it's kept once and
 * tagged with both calendar names.
 */
export function mergeCalendars(lists: CalendarEvent[][]): CalendarEvent[] {
  const byKey = new Map<string, CalendarEvent>();

  for (const event of lists.flat()) {
    // Same title + same time = same event, even if the UIDs differ between accounts
    const key = `${event.title.trim().toLowerCase()}|${event.start}|${event.end}`;
    const existing = byKey.get(key);
    if (existing) {
      for (const s of event.sources) if (!existing.sources.includes(s)) existing.sources.push(s);
    } else {
      byKey.set(key, { ...event, sources: [...event.sources] });
    }
  }

  // All-day events first on a given day, then by start time
  return [...byKey.values()].sort(
    (a, b) => a.startDay.localeCompare(b.startDay) || Number(b.allDay) - Number(a.allDay) || a.start.localeCompare(b.start),
  );
}

export type AgendaDay = { day: string; events: CalendarEvent[] };

/**
 * Groups events into days from `fromDay` for `days` days. Multi-day all-day
 * events (holidays, trips) appear on every day they cover. Empty days are
 * omitted.
 */
export function groupByDay(events: CalendarEvent[], fromDay: string, days: number): AgendaDay[] {
  const agenda: AgendaDay[] = [];
  for (let i = 0; i < days; i++) {
    const day = addDays(fromDay, i);
    const todays = events.filter((e) => (e.allDay ? e.startDay <= day && e.endDay >= day : e.startDay === day));
    if (todays.length > 0) agenda.push({ day, events: todays });
  }
  return agenda;
}
