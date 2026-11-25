-- Initial schema for the personal dashboard.
-- Run this in the Supabase SQL editor, or with `supabase db push` if you use the CLI.

-- To-do list: simple tasks with an optional due date
create table if not exists public.todos (
  id          bigint generated always as identity primary key,
  title       text not null,
  notes       text,
  due_date    date,
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Reminders: importance 1 (unimportant) .. 5 (crucial)
create table if not exists public.reminders (
  id          bigint generated always as identity primary key,
  title       text not null,
  notes       text,
  importance  smallint not null default 3 check (importance between 1 and 5),
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Academic items: assignments, exams, deadlines and events.
-- due_at is a local wall-clock time ("timestamp without time zone") straight
-- from a datetime-local input, so it never shifts with DST.
create table if not exists public.academic_items (
  id          bigint generated always as identity primary key,
  title       text not null,
  kind        text not null default 'assignment'
              check (kind in ('assignment', 'exam', 'deadline', 'event')),
  course      text,
  due_at      timestamp not null,
  location    text,
  url         text,
  notes       text,
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Personal alerts: hackathons, competitions, music, deals, thrifts, other
create table if not exists public.alerts (
  id          bigint generated always as identity primary key,
  title       text not null,
  category    text not null default 'other'
              check (category in ('hackathon', 'competition', 'music', 'deal', 'thrift', 'other')),
  url         text,
  date        date,
  location    text,
  notes       text,
  archived    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Row-level security ON with no policies: the publishable (anon) key can read/write
-- nothing. The dashboard talks to these tables only from the server using the
-- secret key (sb_secret_...), which bypasses RLS.
alter table public.todos          enable row level security;
alter table public.reminders      enable row level security;
alter table public.academic_items enable row level security;
alter table public.alerts         enable row level security;
