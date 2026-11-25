"use server";

import { refresh } from "next/cache";
import { getDb, unwrap } from "@/lib/db";
import { ALERT_CATEGORIES } from "@/lib/db/schema";
import { booleanField, oneOf, optionalString, optionalUrl, requiredId, requiredString } from "./forms";

/** Adds a hackathon / competition / music / deal / thrift / other alert. */
export async function createAlert(form: FormData) {
  unwrap(
    await getDb().from("alerts").insert({
      title: requiredString(form, "title"),
      category: oneOf(form, "category", ALERT_CATEGORIES, "other"),
      url: optionalUrl(form, "url"),
      date: optionalString(form, "date"),
      location: optionalString(form, "location"),
      notes: optionalString(form, "notes"),
    }),
  );
  refresh();
}

/** Moves an alert to (or back from) the archive; form sends the current value. */
export async function toggleAlertArchived(form: FormData) {
  unwrap(
    await getDb()
      .from("alerts")
      .update({ archived: !booleanField(form, "archived") })
      .eq("id", requiredId(form)),
  );
  refresh();
}

/** Permanently removes an alert. */
export async function deleteAlert(form: FormData) {
  unwrap(await getDb().from("alerts").delete().eq("id", requiredId(form)));
  refresh();
}
