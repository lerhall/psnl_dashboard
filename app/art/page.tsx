import type { Metadata } from "next";
import { Suspense } from "react";
import { ArtworkFigure } from "@/components/artwork";
import { Empty, PageHeader } from "@/components/ui";
import { getDailyArt } from "@/lib/art";
import { addDays, formatDay } from "@/lib/dates";
import { getToday } from "@/lib/today";

export const metadata: Metadata = { title: "Art" };

/** Today's picks, large. */
async function TodaysArt() {
  const { today } = await getToday();
  const art = await getDailyArt(today);
  if (art.length === 0) return <Empty>The museums aren&apos;t responding right now. Try again later.</Empty>;
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {art.map((a) => (
        <ArtworkFigure key={a.pageUrl} art={a} sizes="(min-width: 768px) 50vw, 100vw" priority />
      ))}
    </div>
  );
}

/** The previous week's picks, so you don't miss any. Each day is cached separately. */
async function PastWeek() {
  const { today } = await getToday();
  const days = Array.from({ length: 6 }, (_, i) => addDays(today, -(i + 1)));
  const history = await Promise.all(days.map(async (day) => ({ day, art: await getDailyArt(day) })));

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {history.flatMap(({ day, art }) =>
        art.map((a) => (
          <div key={`${day}-${a.pageUrl}`}>
            <p className="mb-1 text-xs text-muted">{formatDay(day)}</p>
            <ArtworkFigure art={a} sizes="(min-width: 1024px) 25vw, 50vw" />
          </div>
        )),
      )}
    </div>
  );
}

export default function ArtPage() {
  return (
    <>
      <PageHeader title="Art" description="A new pair of paintings each day from the Art Institute of Chicago and The Met." />
      <Suspense fallback={<div className="aspect-[2/1] animate-pulse rounded-xl bg-surface-muted" />}>
        <TodaysArt />
      </Suspense>
      <h2 className="mt-12 mb-4 text-lg font-semibold">Earlier this week</h2>
      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <PastWeek />
      </Suspense>
    </>
  );
}
