"use server";

import { refresh } from "next/cache";
import { getDb, unwrap } from "@/lib/db";
import { ACADEMIC_KINDS } from "@/lib/db/schema";
import { booleanField, oneOf, optionalString, optionalUrl, requiredId, requiredString } from "./forms";

/** Adds an assignment / exam / deadline / event. */
export async function createAcademicItem(form: FormData) {
  unwrap(
    await getDb().from("academic_items").insert({
      title: requiredString(form, "title"),
      kind: oneOf(form, "kind", ACADEMIC_KINDS, "assignment"),
      course: optionalString(form, "course"),
      // datetime-local input gives "YYYY-MM-DDTHH:mm"; stored as a local timestamp
      due_at: requiredString(form, "dueAt"),
      location: optionalString(form, "location"),
      url: optionalUrl(form, "url"),
      notes: optionalString(form, "notes"),
    }),
  );
  refresh();
}

/** Marks an item as submitted / attended (or un-marks it); form sends the current value. */
export async function toggleAcademicItem(form: FormData) {
  unwrap(
    await getDb()
      .from("academic_items")
      .update({ completed: !booleanField(form, "completed") })
      .eq("id", requiredId(form)),
  );
  refresh();
}

/** Permanently removes an item. */
export async function deleteAcademicItem(form: FormData) {
  unwrap(await getDb().from("academic_items").delete().eq("id", requiredId(form)));
  refresh();
}
