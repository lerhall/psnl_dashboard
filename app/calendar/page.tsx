import type { Metadata } from "next";
import { Suspense } from "react";
import { CALENDAR_COLORS, colorForSources } from "@/components/calendar-colors";
import { Empty, FilterLink, PageHeader, Problem } from "@/components/ui";
import { getMergedEvents } from "@/lib/calendar";
import { groupByDay } from "@/lib/calendar/merge";
import { formatDay, formatTime, relativeDayLabel } from "@/lib/dates";
import { getToday } from "@/lib/today";

export const metadata: Metadata = { title: "Calendar" };

const RANGES = [7, 14, 30, 60] as const;

/** Agenda view: both Outlook calendars merged and grouped by day. */
async function Agenda({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const { days: daysParam } = await searchParams;
  const days = RANGES.find((r) => String(r) === daysParam) ?? 14;
  const { today } = await getToday();
  const { sources, events } = await getMergedEvents(today, days);
  const agenda = groupByDay(events, today, days);
  const names = sources.map((s) => s.name);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {RANGES.map((r) => (
            <FilterLink key={r} href={`/calendar?days=${r}`} active={r === days}>
              {r} days
            </FilterLink>
          ))}
        </div>
        {/* Legend: which colour is which calendar */}
        <ul className="flex flex-wrap gap-4 text-sm text-muted">
          {sources.map((s, i) => (
            <li key={s.name} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-full ${CALENDAR_COLORS[i % CALENDAR_COLORS.length]}`} /> {s.name}
            </li>
          ))}
          {sources.length > 1 && (
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-accent" /> In both
            </li>
          )}
        </ul>
      </div>

      {sources.length === 0 ? (
        <Problem title="No calendars connected">
          Set OUTLOOK_CALENDAR_1_URL and OUTLOOK_CALENDAR_2_URL in .env.local. docs/calendar.md walks through getting the links from Outlook.
        </Problem>
      ) : agenda.length === 0 ? (
        <Empty>Nothing scheduled in the next {days} days.</Empty>
      ) : (
        <ol className="space-y-6">
          {agenda.map(({ day, events }) => (
            <li key={day} className="grid gap-2 md:grid-cols-[10rem_1fr]">
              <div className="md:pt-3">
                <p className="font-semibold">{relativeDayLabel(day, today)}</p>
                <p className="text-sm text-muted">{formatDay(day)}</p>
              </div>
              <ul className="space-y-2">
                {events.map((event) => (
                  <li key={event.id} className="flex gap-3 rounded-xl border border-border bg-surface p-3">
                    <span className={`w-1 shrink-0 rounded-full ${colorForSources(event.sources, names)}`} />
                    <div className="min-w-0">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted">
                        {event.allDay ? "All day" : `${formatTime(event.start)} – ${formatTime(event.end)}`}
                        {event.location && ` · ${event.location}`}
                        {` · ${event.sources.join(" + ")}`}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

export default function CalendarPage({ searchParams }: PageProps<"/calendar">) {
  return (
    <>
      <PageHeader title="Calendar" description="Your Outlook calendars, combined. Events in both are shown once." />
      <Suspense fallback={<p className="text-sm text-muted">Loading calendars…</p>}>
        <Agenda searchParams={searchParams as Promise<{ days?: string }>} />
      </Suspense>
    </>
  );
}
