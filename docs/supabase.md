# Supabase setup

The to-do list, reminders, academic tracker and personal alerts live in a
Supabase Postgres database. News, calendar and art don't need it.

## 1. Create a project

1. Sign in at https://supabase.com/dashboard and create a new project.
   Pick the region closest to the Pi (London is `eu-west-2`).
2. The free plan is plenty for this. **Note:** free projects are *paused after
   about a week with no activity*. A dashboard you open daily keeps it awake, but
   if it pauses, un-pause it from the Supabase dashboard.

## 2. Create the tables

Open **SQL Editor → New query**, paste in the whole of
`supabase/migrations/0001_init.sql`, and run it. It creates `todos`,
`reminders`, `academic_items` and `alerts`.

If you use the Supabase CLI instead: `supabase link` then `supabase db push`.

## 3. Connect the app

The app uses Supabase's **API key system** (publishable + secret keys).
The legacy JWT-based `anon` / `service_role` keys are being deprecated and are
**not** accepted.

From **Project Settings → API Keys**, copy:

| `.env.local` variable | Value | Required |
| --- | --- | --- |
| `SUPABASE_URL` | Project URL, `https://<ref>.supabase.co` | Yes |
| `SUPABASE_SECRET_KEY` | A **secret** key, `sb_secret_…` | Yes |
| `SUPABASE_PUBLISHABLE_KEY` | The **publishable** key, `sb_publishable_…` | No (kept for future browser-side use) |

If there's no secret key yet, create one on the API Keys page (**Create new
API Keys** / **Add new secret key**). You can make several (e.g. one for the Pi,
one for your laptop) and revoke them individually, which the old single
`service_role` key couldn't do.

Restart `pnpm dev` / the systemd service after editing `.env.local`.

## Security model

- Row-level security is **on** for every table with **no policies**, so the
  publishable key can read and write nothing.
- The app only talks to Supabase from the server, using the secret key, which
  bypasses RLS. `getDb()` refuses anything that isn't an `sb_secret_…` key. `lib/db/index.ts` imports `server-only` so the key can't be
  bundled into browser code by accident.
- **Never** name it `NEXT_PUBLIC_…` and never commit `.env.local`. If a secret
  key leaks, revoke it on the API Keys page and create a new one.
- The dashboard itself has no login, so anyone who can reach the Pi can use
  it. Keep it on your home network or Tailscale (see deployment doc).

## Changing the schema

1. Add a new file, e.g. `supabase/migrations/0002_add_priority.sql`. Don't edit
   `0001` once it has been run.
2. Run it in the SQL editor.
3. Update the matching type in `lib/db/schema.ts` (or generate types with
   `supabase gen types typescript --linked > lib/db/database.types.ts`).

## Backups

Free projects get no point-in-time backups. Occasionally export each table to
CSV from the Table Editor, or run
`pg_dump` with the connection string from **Project Settings → Database**.
