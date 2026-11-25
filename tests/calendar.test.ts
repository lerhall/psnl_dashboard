import { describe, expect, it } from "vitest";
import { expandIcs, type CalendarEvent } from "@/lib/calendar/expand";
import { groupByDay, mergeCalendars } from "@/lib/calendar/merge";

// A trimmed-down Outlook export: Windows timezone name, a weekly event with
// one cancelled occurrence (EXDATE), and an all-day event.
const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VTIMEZONE
TZID:GMT Standard Time
BEGIN:STANDARD
DTSTART:16010101T020000
TZOFFSETFROM:+0100
TZOFFSETTO:+0000
RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=-1SU;BYMONTH=10
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:16010101T010000
TZOFFSETFROM:+0000
TZOFFSETTO:+0100
RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=-1SU;BYMONTH=3
END:DAYLIGHT
END:VTIMEZONE
BEGIN:VEVENT
UID:holiday
SUMMARY:Trip
DTSTART;VALUE=DATE:20261126
DTEND;VALUE=DATE:20261128
END:VEVENT
BEGIN:VEVENT
UID:lecture
SUMMARY:Lecture
LOCATION:Room 1
DTSTART;TZID=GMT Standard Time:20261102T100000
DTEND;TZID=GMT Standard Time:20261102T110000
RRULE:FREQ=WEEKLY;BYDAY=MO
EXDATE;TZID=GMT Standard Time:20261130T100000
END:VEVENT
END:VCALENDAR`;

const range = { from: new Date("2026-11-20T00:00:00Z"), to: new Date("2026-12-10T00:00:00Z") };

describe("expandIcs", () => {
  const events = expandIcs(ics, "Personal", range);

  it("expands recurring events and respects EXDATE", () => {
    const lectures = events.filter((e) => e.title === "Lecture").map((e) => e.startDay);
    expect(lectures).toEqual(["2026-11-23", "2026-12-07"]);
  });

  it("treats all-day end dates as exclusive", () => {
    const trip = events.find((e) => e.title === "Trip")!;
    expect(trip.allDay).toBe(true);
    expect([trip.startDay, trip.endDay]).toEqual(["2026-11-26", "2026-11-27"]);
  });
});

describe("mergeCalendars + groupByDay", () => {
  const base: CalendarEvent = {
    id: "x", title: "Standup", start: "2026-11-24T09:00:00.000Z", end: "2026-11-24T09:15:00.000Z",
    allDay: false, startDay: "2026-11-24", endDay: "2026-11-24", location: null, sources: ["Personal"],
  };

  it("collapses an event that's in both calendars and tags both sources", () => {
    const merged = mergeCalendars([[base], [{ ...base, id: "y", sources: ["Uni"] }]]);
    expect(merged).toHaveLength(1);
    expect(merged[0].sources).toEqual(["Personal", "Uni"]);
  });

  it("shows multi-day all-day events on every day they cover", () => {
    const trip: CalendarEvent = { ...base, id: "t", title: "Trip", allDay: true, startDay: "2026-11-25", endDay: "2026-11-26" };
    const days = groupByDay(mergeCalendars([[base, trip]]), "2026-11-24", 4);
    expect(days.map((d) => [d.day, d.events.map((e) => e.title)])).toEqual([
      ["2026-11-24", ["Standup"]],
      ["2026-11-25", ["Trip"]],
      ["2026-11-26", ["Trip"]],
    ]);
  });
});
