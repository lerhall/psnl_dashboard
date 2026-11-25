# Architecture

Next.js 16 (App Router) with Cache Components, Tailwind v4, and Supabase (Postgres)
for anything you type in yourself. Server-rendered throughout: the only
client-side JavaScript is the nav highlight and the "Saving…" button state.

## Folders

```
app/                       Routes (one folder per page)
  page.tsx                 Overview: every section as a card
  news/ calendar/ todos/ reminders/ academic/ alerts/ art/
  api/health/route.ts      GET /api/health for uptime checks
components/
  widgets/                 The overview cards (one per section)
  ui.tsx                   Card, PageHeader, Badge, FilterLink, Empty, Problem
  row-actions.tsx          Tick-off / delete mini forms
  submit-button.tsx        Pending-aware submit button (client component)
lib/
  db/                      Supabase client (index.ts) + row types (schema.ts)
  data/queries.ts          All reads from Supabase
  actions/                 Server actions: all writes to Supabase
  news/                    Feed list, RSS/Atom/RDF parser, ranking, cached fetch
  calendar/                ICS expansion (recurrence), merging, cached fetch
  art/                     Daily picks from AIC + The Met, cached per day
  dates.ts                 Timezone-aware date helpers (pure)
  importance.ts            Reminder levels 1–5
supabase/migrations/       SQL schema: run once against your project
tests/                     Vitest unit tests for the pure logic
docs/                      You are here
```

## Data flow

| Section | Source | Freshness |
| --- | --- | --- |
| News | ~30 public RSS feeds | Cached 30 min per feed (`cacheLife("news")`) |
| Calendar | 2 Outlook ICS links from `.env.local` | Cached 10 min (`cacheLife("calendar")`) |
| Art | AIC + Met public APIs | Cached per day (`cacheLife("art")`) |
| To-do, Reminders, Academic, Alerts | Supabase tables | Live on every request |

Cache profiles are defined in `next.config.ts`. Supabase reads call
`connection()` first so they always run per request rather than at build time.

**Writes** are server actions (`lib/actions/*`). Each form posts to one, which
writes to Supabase and calls `refresh()` so the page re-renders with the change.
Toggle forms send the row's *current* value; the action stores the opposite.

**Streaming:** every card/list is wrapped in `<Suspense>`, so the page shell
renders instantly and each section fills in when ready. A slow feed never blocks
the rest. Failures are caught per section (`lib/safe.ts`) and shown as a
yellow notice instead of an error page.

## Adding a new section

1. Data: add a table in a new `supabase/migrations/000X_*.sql`, plus a row type
   in `lib/db/schema.ts`, a query in `lib/data/queries.ts`, and actions in
   `lib/actions/`. For an external source, add `lib/<name>/index.ts` with a
   `"use cache"` function instead.
2. Page: `app/<name>/page.tsx`
3. Card: `components/widgets/<name>-widget.tsx`, added to `app/page.tsx`
4. Nav: add it to `SECTIONS` in `components/nav.tsx`

## Commands

| | |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build && pnpm start` | Production |
| `pnpm test` | Unit tests |
| `pnpm lint` | ESLint |
