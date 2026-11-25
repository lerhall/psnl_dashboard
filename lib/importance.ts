// The five reminder importance levels, lowest to highest.
// Stored in the DB as the number; the label/colour are purely presentational.
export const IMPORTANCE_LEVELS = [
  { value: 1, label: "Unimportant", className: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-300" },
  { value: 2, label: "Low", className: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  { value: 3, label: "Medium", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  { value: 4, label: "High", className: "bg-orange-500/15 text-orange-700 dark:text-orange-300" },
  { value: 5, label: "Crucial", className: "bg-red-500/15 text-red-700 dark:text-red-300" },
] as const;

/** Looks up a level, clamping anything out of range into 1–5. */
export function importanceLevel(value: number) {
  const clamped = Math.min(5, Math.max(1, Math.round(value)));
  return IMPORTANCE_LEVELS[clamped - 1];
}
