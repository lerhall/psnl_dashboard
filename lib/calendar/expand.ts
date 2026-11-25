import ical from "node-ical";
import { toISODate } from "@/lib/dates";

// Parses an ICS file and expands it into concrete event instances within a
// date range (recurring events become one entry per occurrence).

export type CalendarEvent = {
  /** Unique per occurrence: uid + start */
  id: string;
  title: string;
  /** ISO instant for timed events */
  start: string;
  end: string;
  allDay: boolean;
  /** For all-day events: first day and last day (inclusive), "YYYY-MM-DD" */
  startDay: string;
  endDay: string;
  location: string | null;
  /** Names of the calendars this event appears in (2 if it's in both) */
  sources: string[];
};

/** node-ical gives text either as a string or as { val, params }. */
function textOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "val" in value) return String((value as { val: unknown }).val);
  return "";
}

/** All-day dates are parsed as midnight server-local time, so read local parts. */
function localDay(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function expandIcs(
  icsText: string,
  sourceName: string,
  range: { from: Date; to: Date },
): CalendarEvent[] {
  const parsed = ical.sync.parseICS(icsText);
  const events: CalendarEvent[] = [];

  for (const component of Object.values(parsed)) {
    if (!component || component.type !== "VEVENT") continue;
    // Outlook marks deleted/declined occurrences as cancelled
    if ((component as { status?: string }).status === "CANCELLED") continue;

    // expandRecurringEvent handles both one-off and recurring events, and
    // already applies EXDATEs and moved occurrences (RECURRENCE-ID)
    let instances;
    try {
      instances = ical.expandRecurringEvent(component, { ...range, expandOngoing: true });
    } catch (error) {
      console.warn(`[calendar] skipped an event in ${sourceName}:`, error);
      continue;
    }

    for (const instance of instances) {
      const start = instance.start;
      // Some events have no DTEND; treat them as instantaneous
      const end = instance.end ?? instance.start;
      const allDay = instance.isFullDay;

      // All-day DTEND is exclusive (an event on the 26th ends on the 27th), so step back a day
      const startDay = allDay ? localDay(start) : toISODate(start);
      let endDay = allDay ? localDay(new Date(end.getTime() - 1)) : toISODate(end);
      if (endDay < startDay) endDay = startDay;

      events.push({
        id: `${instance.event.uid ?? textOf(instance.summary)}@${start.toISOString()}`,
        title: textOf(instance.summary) || "(No title)",
        start: start.toISOString(),
        end: end.toISOString(),
        allDay,
        startDay,
        endDay,
        location: textOf(instance.event.location) || null,
        sources: [sourceName],
      });
    }
  }

  return events;
}
