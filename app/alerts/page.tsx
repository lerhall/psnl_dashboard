import type { Metadata } from "next";
import { Suspense } from "react";
import { ALERT_CATEGORY_META } from "@/components/alert-categories";
import { DeleteForm } from "@/components/row-actions";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Empty, FilterLink, PageHeader, Problem } from "@/components/ui";
import { createAlert, deleteAlert, toggleAlertArchived } from "@/lib/actions/alerts";
import { getAlerts } from "@/lib/data/queries";
import { ALERT_CATEGORIES, type AlertCategory } from "@/lib/db/schema";
import { formatDay, relativeDayLabel, urgencyFor } from "@/lib/dates";
import { safely } from "@/lib/safe";
import { getToday } from "@/lib/today";

export const metadata: Metadata = { title: "Personal alerts" };

type Search = { category?: string; view?: string };

/** Cards for each alert, filterable by category, with an archive view. */
async function AlertBoard({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const category = ALERT_CATEGORIES.find((c) => c === params.category);
  const archived = params.view === "archived";
  const { today } = await getToday();

  const result = await safely(() => getAlerts({ archived }));
  if (result.error !== null) return <Problem title="Couldn't load alerts">{result.error}</Problem>;
  const alerts = category ? result.data.filter((a) => a.category === category) : result.data;

  // Keep the other filter when switching one
  const href = (next: { category?: AlertCategory; archived?: boolean }) => {
    const qs = new URLSearchParams();
    if (next.category) qs.set("category", next.category);
    if (next.archived) qs.set("view", "archived");
    return qs.size ? `/alerts?${qs}` : "/alerts";
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <FilterLink href={href({ archived })} active={!category}>All</FilterLink>
          {ALERT_CATEGORIES.map((c) => (
            <FilterLink key={c} href={href({ category: c, archived })} active={category === c}>
              {ALERT_CATEGORY_META[c].label}
            </FilterLink>
          ))}
        </div>
        <div className="flex gap-2">
          <FilterLink href={href({ category })} active={!archived}>Active</FilterLink>
          <FilterLink href={href({ category, archived: true })} active={archived}>Archived</FilterLink>
        </div>
      </div>

      {alerts.length === 0 ? (
        <Empty>{archived ? "Nothing archived." : "No alerts here yet. Add one above."}</Empty>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {alerts.map((alert) => {
            const meta = ALERT_CATEGORY_META[alert.category];
            return (
              <li key={alert.id} className="flex flex-col rounded-xl border border-border bg-surface p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge className={meta.className}>{meta.label}</Badge>
                  {alert.date && (
                    <Badge urgency={archived ? "none" : urgencyFor(alert.date, today)}>
                      {formatDay(alert.date)} · {relativeDayLabel(alert.date, today)}
                    </Badge>
                  )}
                </div>
                <p className="font-medium">
                  {alert.url ? (
                    <a href={alert.url} target="_blank" rel="noreferrer" className="hover:underline">{alert.title} ↗</a>
                  ) : (
                    alert.title
                  )}
                </p>
                {alert.location && <p className="text-sm text-muted">{alert.location}</p>}
                {alert.notes && <p className="mt-1 text-sm text-muted">{alert.notes}</p>}
                <div className="mt-auto flex items-center justify-end gap-2 pt-3">
                  <form action={toggleAlertArchived}>
                    <input type="hidden" name="id" value={alert.id} />
                    <input type="hidden" name="archived" value={String(alert.archived)} />
                    <button type="submit" className="text-xs text-muted hover:text-foreground">
                      {alert.archived ? "Restore" : "Archive"}
                    </button>
                  </form>
                  <DeleteForm action={deleteAlert} id={alert.id} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default function AlertsPage({ searchParams }: PageProps<"/alerts">) {
  return (
    <>
      <PageHeader
        title="Personal alerts"
        description="Hackathons, competitions, music announcements, deals, local thrifts, and anything else worth watching. See docs/personal-alerts.md for where to find them."
      />

      <form action={createAlert} className="mb-8 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label htmlFor="al-title" className="label">Title</label>
          <input id="al-title" name="title" required placeholder="HackLondon 2027 registrations open" className="input" />
        </div>
        <div>
          <label htmlFor="al-category" className="label">Category</label>
          <select id="al-category" name="category" defaultValue="hackathon" className="input">
            {ALERT_CATEGORIES.map((c) => <option key={c} value={c}>{ALERT_CATEGORY_META[c].label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="al-date" className="label">Date / deadline</label>
          <input id="al-date" name="date" type="date" className="input" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="al-url" className="label">Link</label>
          <input id="al-url" name="url" type="url" placeholder="https://" className="input" />
        </div>
        <div>
          <label htmlFor="al-location" className="label">Location</label>
          <input id="al-location" name="location" className="input" />
        </div>
        <div className="flex items-end">
          <SubmitButton className="w-full">Add alert</SubmitButton>
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <label htmlFor="al-notes" className="label">Notes</label>
          <input id="al-notes" name="notes" className="input" />
        </div>
      </form>

      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <AlertBoard searchParams={searchParams as Promise<Search>} />
      </Suspense>
    </>
  );
}
