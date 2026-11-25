import type { Metadata } from "next";
import { Suspense } from "react";
import { DeleteForm, ToggleForm } from "@/components/row-actions";
import { SubmitButton } from "@/components/submit-button";
import { Empty, PageHeader, Problem } from "@/components/ui";
import { createReminder, deleteReminder, setReminderImportance, toggleReminder } from "@/lib/actions/reminders";
import { getReminders } from "@/lib/data/queries";
import type { Reminder } from "@/lib/db/schema";
import { IMPORTANCE_LEVELS, importanceLevel } from "@/lib/importance";
import { safely } from "@/lib/safe";

export const metadata: Metadata = { title: "Reminders" };

/** Lets you bump a reminder up or down a level without retyping it. */
function ImportanceStepper({ reminder }: { reminder: Reminder }) {
  const level = importanceLevel(reminder.importance);
  const step = (delta: number) => Math.min(5, Math.max(1, reminder.importance + delta));
  return (
    <div className={`flex items-center rounded-full text-xs font-medium ${level.className}`}>
      <form action={setReminderImportance}>
        <input type="hidden" name="id" value={reminder.id} />
        <input type="hidden" name="importance" value={step(-1)} />
        <button type="submit" aria-label="Less important" className="px-2 py-0.5 disabled:opacity-30" disabled={reminder.importance <= 1}>−</button>
      </form>
      <span className="w-20 text-center">{level.label}</span>
      <form action={setReminderImportance}>
        <input type="hidden" name="id" value={reminder.id} />
        <input type="hidden" name="importance" value={step(1)} />
        <button type="submit" aria-label="More important" className="px-2 py-0.5 disabled:opacity-30" disabled={reminder.importance >= 5}>+</button>
      </form>
    </div>
  );
}

/** Open reminders grouped by importance (crucial first), then done ones. */
async function ReminderList() {
  const result = await safely(() => getReminders());
  if (result.error !== null) return <Problem title="Couldn't load reminders">{result.error}</Problem>;

  const open = result.data.filter((r) => !r.completed);
  const done = result.data.filter((r) => r.completed);
  if (result.data.length === 0) return <Empty>No reminders yet.</Empty>;

  return (
    <div className="space-y-6">
      {[...IMPORTANCE_LEVELS].reverse().map((level) => {
        const group = open.filter((r) => importanceLevel(r.importance).value === level.value);
        if (group.length === 0) return null;
        return (
          <section key={level.value}>
            <h2 className="mb-2 text-sm font-semibold text-muted">{level.label}</h2>
            <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
              {group.map((reminder) => (
                <li key={reminder.id} className="flex flex-wrap items-start gap-3 p-3">
                  <ToggleForm action={toggleReminder} id={reminder.id} current={false} label={`Mark "${reminder.title}" done`} />
                  <div className="min-w-0 flex-1">
                    <p>{reminder.title}</p>
                    {reminder.notes && <p className="text-sm text-muted">{reminder.notes}</p>}
                  </div>
                  <ImportanceStepper reminder={reminder} />
                  <DeleteForm action={deleteReminder} id={reminder.id} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {done.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-muted">Done ({done.length})</h2>
          <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
            {done.map((reminder) => (
              <li key={reminder.id} className="flex items-start gap-3 p-3 text-muted">
                <ToggleForm action={toggleReminder} id={reminder.id} current label={`Mark "${reminder.title}" not done`} />
                <p className="min-w-0 flex-1 line-through">{reminder.title}</p>
                <DeleteForm action={deleteReminder} id={reminder.id} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default function RemindersPage() {
  return (
    <>
      <PageHeader title="Reminders" description="Things to remember, from unimportant to crucial." />

      <form action={createReminder} className="mb-8 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[1fr_11rem_auto] sm:items-end">
        <div>
          <label htmlFor="reminder-title" className="label">Reminder</label>
          <input id="reminder-title" name="title" required placeholder="Remember to…" className="input" />
        </div>
        <div>
          <label htmlFor="reminder-importance" className="label">Importance</label>
          <select id="reminder-importance" name="importance" defaultValue="3" className="input">
            {IMPORTANCE_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
        <SubmitButton>Add</SubmitButton>
        <div className="sm:col-span-3">
          <label htmlFor="reminder-notes" className="label">Notes (optional)</label>
          <input id="reminder-notes" name="notes" className="input" />
        </div>
      </form>

      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <ReminderList />
      </Suspense>
    </>
  );
}
