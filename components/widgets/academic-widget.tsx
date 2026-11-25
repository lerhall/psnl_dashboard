import { Badge, Card, Empty, Problem } from "@/components/ui";
import { getAcademicItems } from "@/lib/data/queries";
import { formatLocalDateTime, relativeDayLabel, urgencyFor } from "@/lib/dates";
import { safely } from "@/lib/safe";
import { getToday } from "@/lib/today";

/** Upcoming assignments, exams, deadlines and events. */
export async function AcademicWidget() {
  const { today } = await getToday();
  const result = await safely(() => getAcademicItems({ includeCompleted: false }));
  // Hide events that have already happened; overdue assignments stay visible
  const items = result.data?.filter((i) => i.kind !== "event" || i.due_at.slice(0, 10) >= today) ?? [];

  return (
    <Card title="Academic" href="/academic">
      {result.error !== null ? (
        <Problem title="Couldn't load academic items">{result.error}</Problem>
      ) : items.length === 0 ? (
        <Empty>Nothing coming up.</Empty>
      ) : (
        <ul className="space-y-2.5">
          {items.slice(0, 6).map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{item.title}</p>
                <p className="text-xs text-muted capitalize">
                  {item.kind}
                  {item.course && ` · ${item.course}`} · {formatLocalDateTime(item.due_at)}
                </p>
              </div>
              <Badge urgency={urgencyFor(item.due_at.slice(0, 10), today)}>{relativeDayLabel(item.due_at.slice(0, 10), today)}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
