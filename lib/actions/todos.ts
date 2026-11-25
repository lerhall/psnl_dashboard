"use server";

import { refresh } from "next/cache";
import { getDb, unwrap } from "@/lib/db";
import { booleanField, optionalString, requiredId, requiredString } from "./forms";

// NOTE: server actions are plain POST endpoints. There's no login on this
// dashboard, so keep it on your home network / Tailscale.

/** Adds a new to-do from the "add task" form. */
export async function createTodo(form: FormData) {
  unwrap(
    await getDb().from("todos").insert({
      title: requiredString(form, "title"),
      due_date: optionalString(form, "dueDate"),
      notes: optionalString(form, "notes"),
    }),
  );
  // Re-render the current page so the new task shows up immediately
  refresh();
}

/**
 * Flips a to-do between done and not done. The form sends the current value
 * in a hidden "completed" input, so we just store the opposite.
 */
export async function toggleTodo(form: FormData) {
  unwrap(
    await getDb()
      .from("todos")
      .update({ completed: !booleanField(form, "completed") })
      .eq("id", requiredId(form)),
  );
  refresh();
}

/** Permanently removes a to-do. */
export async function deleteTodo(form: FormData) {
  unwrap(await getDb().from("todos").delete().eq("id", requiredId(form)));
  refresh();
}

/** Clears out every completed to-do in one go. */
export async function clearCompletedTodos() {
  unwrap(await getDb().from("todos").delete().eq("completed", true));
  refresh();
}
