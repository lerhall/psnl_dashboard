"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Every section of the dashboard. The order here is the order in the sidebar.
export const SECTIONS = [
  { href: "/", label: "Overview" },
  { href: "/news", label: "News" },
  { href: "/calendar", label: "Calendar" },
  { href: "/todos", label: "To-do" },
  { href: "/reminders", label: "Reminders" },
  { href: "/academic", label: "Academic" },
  { href: "/alerts", label: "Alerts" },
  { href: "/art", label: "Art" },
] as const;

/** Sidebar on desktop, horizontally scrolling tab bar on phones. */
export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur md:h-screen md:w-52 md:shrink-0 md:border-r md:border-b-0">
      <div className="hidden px-5 pt-6 pb-4 md:block">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Dashboard
        </Link>
      </div>
      <ul className="flex gap-1 overflow-x-auto px-2 py-2 md:flex-col md:overflow-visible md:px-3">
        {SECTIONS.map(({ href, label }) => {
          // "/" only matches exactly; other sections also match their sub-pages
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`block whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "bg-accent/12 font-medium text-accent" : "text-muted hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
