import type { Metadata } from "next";
import { Suspense } from "react";
import { NewsGrid } from "@/components/news-grid";
import { Empty, FilterLink, PageHeader } from "@/components/ui";
import { timeAgo } from "@/lib/dates";
import { getNews } from "@/lib/news";
import { REGIONS, REGION_LABELS, TOPICS, TOPIC_LABELS, type Region, type Topic } from "@/lib/news/feeds";
import { getToday } from "@/lib/today";

export const metadata: Metadata = { title: "News" };

type Search = { topic?: string; region?: string };

/** Builds a /news URL that keeps the other filter when one changes. */
function newsHref(current: { topic?: Topic; region?: Region }, change: Partial<Record<"topic" | "region", string | undefined>>) {
  const next = { ...current, ...change };
  const params = new URLSearchParams();
  if (next.topic) params.set("topic", next.topic);
  if (next.region) params.set("region", next.region);
  const qs = params.toString();
  return qs ? `/news?${qs}` : "/news";
}

/** Reads ?topic=&region= (request-time data) and renders filters + stories. */
async function NewsResults({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  // Ignore anything in the URL that isn't a known topic/region
  const topic = TOPICS.find((t) => t === params.topic);
  const region = REGIONS.find((r) => r === params.region);
  const current = { topic, region };

  const [{ now }, stories] = await Promise.all([getToday(), getNews({ topic, region }, 80)]);

  return (
    <>
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap gap-2">
          <FilterLink href={newsHref(current, { topic: undefined })} active={!topic}>All topics</FilterLink>
          {TOPICS.map((t) => (
            <FilterLink key={t} href={newsHref(current, { topic: t })} active={topic === t}>
              {TOPIC_LABELS[t]}
            </FilterLink>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterLink href={newsHref(current, { region: undefined })} active={!region}>All regions</FilterLink>
          {REGIONS.map((r) => (
            <FilterLink key={r} href={newsHref(current, { region: r })} active={region === r}>
              {REGION_LABELS[r]}
            </FilterLink>
          ))}
        </div>
      </div>

      {stories.length === 0 ? (
        <Empty>No stories for this filter right now.</Empty>
      ) : (
        // key resets the "Show more" count whenever the filter changes
        <NewsGrid
          key={`${topic ?? "all"}-${region ?? "all"}`}
          stories={stories.map((story) => ({
            link: story.link,
            title: story.title,
            summary: story.summary,
            topicLabel: TOPIC_LABELS[story.topic],
            // Format "UK · BBC · 2h ago" here on the server, where "now" is known
            meta: [REGION_LABELS[story.region], story.source, story.publishedAt && timeAgo(story.publishedAt, now)]
              .filter(Boolean)
              .join(" · "),
          }))}
        />
      )}
    </>
  );
}

export default function NewsPage({ searchParams }: PageProps<"/news">) {
  return (
    <>
      <PageHeader title="News" description="Top stories in tech, finance, politics and climate from the UK, EU, USA, China and worldwide. Refreshed every 30 minutes." />
      <Suspense fallback={<p className="text-sm text-muted">Loading stories…</p>}>
        <NewsResults searchParams={searchParams as Promise<Search>} />
      </Suspense>
    </>
  );
}
