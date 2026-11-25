import type { AlertCategory } from "@/lib/db/schema";

// Display label + colour for each personal-alert category.
export const ALERT_CATEGORY_META: Record<AlertCategory, { label: string; className: string }> = {
  hackathon: { label: "Hackathon", className: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
  competition: { label: "Competition", className: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  music: { label: "Music", className: "bg-pink-500/15 text-pink-700 dark:text-pink-300" },
  deal: { label: "Deal", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  thrift: { label: "Thrift", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  other: { label: "Other", className: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-300" },
};
