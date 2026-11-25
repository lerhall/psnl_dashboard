import Link from "next/link";
import type { ReactNode } from "react";
import type { Urgency } from "@/lib/dates";

// Small presentational building blocks shared across pages and widgets.

/** Title + optional description at the top of each sub-page. */
export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {children}
    </header>
  );
}

/** A dashboard tile. `href` adds a "View all" link to the section's page. */
export function Card({
  title,
  href,
  children,
  className = "",
}: {
  title: string;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`flex flex-col rounded-2xl border border-border bg-surface p-5 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">{title}</h2>
        {href && (
          <Link href={href} className="text-xs font-medium text-accent hover:underline">
            View all →
          </Link>
        )}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}

/** Placeholder shown while a card's data streams in. */
export function CardSkeleton({ title, rows = 4, className = "" }: { title: string; rows?: number; className?: string }) {
  return (
    <Card title={title} className={className}>
      <div className="space-y-3" aria-busy="true" aria-label={`Loading ${title}`}>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-surface-muted" style={{ width: `${90 - i * 12}%` }} />
        ))}
      </div>
    </Card>
  );
}

/** Friendly "nothing here" message. */
export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-4 text-sm text-muted">{children}</p>;
}

/** Shown when a data source isn't set up yet or failed to load. */
export function Problem({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
      <p className="font-medium text-amber-700 dark:text-amber-300">{title}</p>
      {children && <div className="mt-1 text-muted">{children}</div>}
    </div>
  );
}

const URGENCY_STYLES: Record<Urgency, string> = {
  overdue: "bg-red-500/15 text-red-700 dark:text-red-300",
  today: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  soon: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  later: "bg-surface-muted text-muted",
  none: "bg-surface-muted text-muted",
};

/** Coloured pill: red when overdue, orange today, amber in the next 3 days. */
export function Badge({ urgency = "none", className = "", children }: { urgency?: Urgency; className?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${className || URGENCY_STYLES[urgency]}`}>
      {children}
    </span>
  );
}

/** Pill-shaped filter link used for tabs (news topics, alert views...). */
export function FilterLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        active ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
