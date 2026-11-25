import { ToggleForm } from "@/components/row-actions";
import { Badge, Card, Empty, Problem } from "@/components/ui";
import { toggleReminder } from "@/lib/actions/reminders";
import { getReminders } from "@/lib/data/queries";
import { importanceLevel } from "@/lib/importance";
import { safely } from "@/lib/safe";

/** The most important open reminders. */
export async function RemindersWidget() {
  const result = await safely(() => getReminders({ includeCompleted: false }));

  return (
    <Card title="Reminders" href="/reminders">
      {result.error !== null ? (
        <Problem title="Couldn't load reminders">{result.error}</Problem>
      ) : result.data.length === 0 ? (
        <Empty>No reminders.</Empty>
      ) : (
        <ul className="space-y-2">
          {result.data.slice(0, 7).map((reminder) => {
            const level = importanceLevel(reminder.importance);
            return (
              <li key={reminder.id} className="flex items-start gap-2.5 text-sm">
                <ToggleForm action={toggleReminder} id={reminder.id} current={reminder.completed} label={`Mark "${reminder.title}" done`} />
                <span className="min-w-0 flex-1">{reminder.title}</span>
                <Badge className={level.className}>{level.label}</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
