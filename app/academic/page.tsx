import type { Metadata } from "next";
import { Suspense } from "react";
import { DeleteForm, ToggleForm } from "@/components/row-actions";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Empty, PageHeader, Problem } from "@/components/ui";
import { createAcademicItem, deleteAcademicItem, toggleAcademicItem } from "@/lib/actions/academic";
import { getAcademicItems } from "@/lib/data/queries";
import { ACADEMIC_KINDS, type AcademicItem } from "@/lib/db/schema";
import { formatLocalDateTime, relativeDayLabel, urgencyFor } from "@/lib/dates";
import { safely } from "@/lib/safe";
import { getToday } from "@/lib/today";

export const metadata: Metadata = { title: "Academic" };

/** One assignment/exam/event row. */
function ItemRow({ item, today }: { item: AcademicItem; today: string }) {
  const day = item.due_at.slice(0, 10);
  return (
    <li className={`flex items-start gap-3 p-3 ${item.completed ? "text-muted" : ""}`}>
      <ToggleForm
        action={toggleAcademicItem}
        id={item.id}
        current={item.completed}
        label={item.completed ? `Mark "${item.title}" not done` : `Mark "${item.title}" done`}
      />
      <div className="min-w-0 flex-1">
        <p className={`font-medium ${item.completed ? "line-through" : ""}`}>
          {item.url ? (
            <a href={item.url} target="_blank" rel="noreferrer" className="hover:underline">{item.title}</a>
          ) : (
            item.title
          )}
        </p>
        <p className="text-sm text-muted">
          <span className="capitalize">{item.kind}</span>
          {item.course && ` · ${item.course}`} · {formatLocalDateTime(item.due_at)}
          {item.location && ` · ${item.location}`}
        </p>
        {item.notes && <p className="mt-1 text-sm text-muted">{item.notes}</p>}
      </div>
      {!item.completed && <Badge urgency={urgencyFor(day, today)}>{relativeDayLabel(day, today)}</Badge>}
      <DeleteForm action={deleteAcademicItem} id={item.id} />
    </li>
  );
}

/** Split into "things due" (assignments/exams/deadlines) and "events". */
async function AcademicLists() {
  const { today } = await getToday();
  const result = await safely(() => getAcademicItems());
  if (result.error !== null) return <Problem title="Couldn't load academic items">{result.error}</Problem>;

  const due = result.data.filter((i) => i.kind !== "event" && !i.completed);
  const events = result.data.filter((i) => i.kind === "event" && i.due_at.slice(0, 10) >= today);
  const finished = result.data.filter((i) => i.completed);

  const list = (items: AcademicItem[]) => (
    <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
      {items.map((item) => <ItemRow key={item.id} item={item} today={today} />)}
    </ul>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section>
        <h2 className="mb-2 text-sm font-semibold text-muted">Assignments, exams &amp; deadlines</h2>
        {due.length === 0 ? <Empty>Nothing due.</Empty> : list(due)}
      </section>
      <section>
        <h2 className="mb-2 text-sm font-semibold text-muted">Upcoming events</h2>
        {events.length === 0 ? <Empty>No upcoming events.</Empty> : list(events)}
      </section>
      {finished.length > 0 && (
        <section className="lg:col-span-2">
          <h2 className="mb-2 text-sm font-semibold text-muted">Done ({finished.length})</h2>
          {list(finished)}
        </section>
      )}
    </div>
  );
}

export default function AcademicPage() {
  return (
    <>
      <PageHeader title="Academic" description="Assignments and their due dates, plus academic events." />

      <form action={createAcademicItem} className="mb-8 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label htmlFor="ac-title" className="label">Title</label>
          <input id="ac-title" name="title" required placeholder="Coursework 2: report" className="input" />
        </div>
        <div>
          <label htmlFor="ac-kind" className="label">Type</label>
          <select id="ac-kind" name="kind" defaultValue="assignment" className="input capitalize">
            {ACADEMIC_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="ac-due" className="label">Due / starts</label>
          <input id="ac-due" name="dueAt" type="datetime-local" required className="input" />
        </div>
        <div>
          <label htmlFor="ac-course" className="label">Module / course</label>
          <input id="ac-course" name="course" placeholder="COMP1234" className="input" />
        </div>
        <div>
          <label htmlFor="ac-location" className="label">Location</label>
          <input id="ac-location" name="location" className="input" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ac-url" className="label">Link (Moodle, brief, submission page…)</label>
          <input id="ac-url" name="url" type="url" placeholder="https://" className="input" />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label htmlFor="ac-notes" className="label">Notes</label>
          <input id="ac-notes" name="notes" className="input" />
        </div>
        <div className="flex items-end">
          <SubmitButton className="w-full">Add</SubmitButton>
        </div>
      </form>

      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <AcademicLists />
      </Suspense>
    </>
  );
}
