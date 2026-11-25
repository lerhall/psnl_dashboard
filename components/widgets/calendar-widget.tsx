import { colorForSources } from "@/components/calendar-colors";
import { Card, Empty, Problem } from "@/components/ui";
import { getMergedEvents } from "@/lib/calendar";
import { groupByDay } from "@/lib/calendar/merge";
import { formatTime, relativeDayLabel, formatDay } from "@/lib/dates";
import { getToday } from "@/lib/today";

/** The next few days from both Outlook calendars combined. */
export async function CalendarWidget() {
  const { today } = await getToday();
  const days = 5;
  const { sources, events } = await getMergedEvents(today, days);
  const agenda = groupByDay(events, today, days);
  const names = sources.map((s) => s.name);

  return (
    <Card title="Calendar" href="/calendar">
      {sources.length === 0 ? (
        <Problem title="No calendars connected">Add your Outlook ICS links to .env.local (see docs/calendar.md).</Problem>
      ) : agenda.length === 0 ? (
        <Empty>Nothing in the next {days} days.</Empty>
      ) : (
        <div className="space-y-4">
          {agenda.map(({ day, events }) => (
            <div key={day}>
              <p className="mb-1 text-xs font-semibold text-muted">
                {relativeDayLabel(day, today)} · {formatDay(day)}
              </p>
              <ul className="space-y-1.5">
                {events.slice(0, 5).map((event) => (
                  <li key={event.id} className="flex items-start gap-2 text-sm">
                    <span className={`mt-1.5 size-2 shrink-0 rounded-full ${colorForSources(event.sources, names)}`} />
                    <span className="w-12 shrink-0 text-muted tabular-nums">{event.allDay ? "All day" : formatTime(event.start)}</span>
                    <span className="min-w-0 truncate">{event.title}</span>
                  </li>
                ))}
                {events.length > 5 && <li className="pl-4 text-xs text-muted">+{events.length - 5} more</li>}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
