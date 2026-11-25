import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui";
import { AcademicWidget } from "@/components/widgets/academic-widget";
import { AlertsWidget } from "@/components/widgets/alerts-widget";
import { ArtWidget } from "@/components/widgets/art-widget";
import { CalendarWidget } from "@/components/widgets/calendar-widget";
import { NewsWidget } from "@/components/widgets/news-widget";
import { RemindersWidget } from "@/components/widgets/reminders-widget";
import { TodosWidget } from "@/components/widgets/todos-widget";
import { formatDay } from "@/lib/dates";
import { getToday } from "@/lib/today";

/** "Good morning · Tue 24 Nov". Streams in because it depends on the current time. */
async function Greeting() {
  const { now, today } = await getToday();
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: process.env.DASHBOARD_TIMEZONE ?? "Europe/London" }).format(now));
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">{greeting}</h1>
      <p className="mt-1 text-sm text-muted">{formatDay(today)}</p>
    </>
  );
}

// The overview: every section as a card. Each card is wrapped in its own
// <Suspense> so the page shell appears instantly and each card streams in as
// soon as its data is ready; a slow news feed never blocks your to-dos.
export default function DashboardPage() {
  return (
    <>
      <header className="mb-6 min-h-14">
        <Suspense fallback={<h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>}>
          <Greeting />
        </Suspense>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<CardSkeleton title="News" rows={4} />}>
          <NewsWidget />
        </Suspense>
        <Suspense fallback={<CardSkeleton title="Calendar" rows={6} />}>
          <CalendarWidget />
        </Suspense>
        <Suspense fallback={<CardSkeleton title="To-do" />}>
          <TodosWidget />
        </Suspense>
        <Suspense fallback={<CardSkeleton title="Reminders" />}>
          <RemindersWidget />
        </Suspense>
        <Suspense fallback={<CardSkeleton title="Academic" />}>
          <AcademicWidget />
        </Suspense>
        <Suspense fallback={<CardSkeleton title="Personal alerts" />}>
          <AlertsWidget />
        </Suspense>
        <Suspense fallback={<CardSkeleton title="Art of the day" rows={8} />}>
          <ArtWidget />
        </Suspense>
      </div>
    </>
  );
}
