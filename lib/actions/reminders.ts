"use server";

import { refresh } from "next/cache";
import { getDb, unwrap } from "@/lib/db";
import { booleanField, optionalString, requiredId, requiredString } from "./forms";

/** Reads the 1–5 importance from the form, defaulting to 3 (Medium). */
function readImportance(form: FormData): number {
  const n = Number(form.get("importance"));
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : 3;
}

/** Adds a new reminder. */
export async function createReminder(form: FormData) {
  unwrap(
    await getDb().from("reminders").insert({
      title: requiredString(form, "title"),
      importance: readImportance(form),
      notes: optionalString(form, "notes"),
    }),
  );
  refresh();
}

/** Changes how important a reminder is (from the inline select). */
export async function setReminderImportance(form: FormData) {
  unwrap(
    await getDb()
      .from("reminders")
      .update({ importance: readImportance(form) })
      .eq("id", requiredId(form)),
  );
  refresh();
}

/** Marks a reminder as dealt with (or un-marks it); form sends the current value. */
export async function toggleReminder(form: FormData) {
  unwrap(
    await getDb()
      .from("reminders")
      .update({ completed: !booleanField(form, "completed") })
      .eq("id", requiredId(form)),
  );
  refresh();
}

/** Permanently removes a reminder. */
export async function deleteReminder(form: FormData) {
  unwrap(await getDb().from("reminders").delete().eq("id", requiredId(form)));
  refresh();
}
