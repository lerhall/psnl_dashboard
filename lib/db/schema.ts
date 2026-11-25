// Row types and enum values for the Supabase tables.
// The source of truth for the schema is supabase/migrations/*.sql; keep these
// in sync with it (or replace them with `supabase gen types typescript` later).

/** The kinds of academic item we track. */
export const ACADEMIC_KINDS = ["assignment", "exam", "deadline", "event"] as const;
export type AcademicKind = (typeof ACADEMIC_KINDS)[number];

/** Categories for the personal alerts board. */
export const ALERT_CATEGORIES = ["hackathon", "competition", "music", "deal", "thrift", "other"] as const;
export type AlertCategory = (typeof ALERT_CATEGORIES)[number];

/** To-do: due_date is a "YYYY-MM-DD" date (no timezone). */
export type Todo = {
  id: number;
  title: string;
  notes: string | null;
  due_date: string | null;
  completed: boolean;
  created_at: string;
};

/** Reminder: importance runs 1 (unimportant) to 5 (crucial); labels in lib/importance.ts. */
export type Reminder = {
  id: number;
  title: string;
  notes: string | null;
  importance: number;
  completed: boolean;
  created_at: string;
};

/** Academic item: due_at is a local "YYYY-MM-DDTHH:mm:ss" wall-clock time. */
export type AcademicItem = {
  id: number;
  title: string;
  kind: AcademicKind;
  course: string | null;
  due_at: string;
  location: string | null;
  url: string | null;
  notes: string | null;
  completed: boolean;
  created_at: string;
};

/** Personal alert: date is an optional "YYYY-MM-DD" (event day or deadline). */
export type Alert = {
  id: number;
  title: string;
  category: AlertCategory;
  url: string | null;
  date: string | null;
  location: string | null;
  notes: string | null;
  archived: boolean;
  created_at: string;
};
