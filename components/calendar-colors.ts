// One colour per Outlook calendar (by its position in .env), used for the
// dot/stripe next to each event so you can tell the calendars apart.
export const CALENDAR_COLORS = ["bg-sky-500", "bg-emerald-500", "bg-fuchsia-500"] as const;

export function colorForSources(sources: string[], names: string[]): string {
  // An event that's in both calendars gets the accent colour instead
  if (sources.length > 1) return "bg-accent";
  const index = names.indexOf(sources[0]);
  return CALENDAR_COLORS[Math.max(0, index) % CALENDAR_COLORS.length];
}
