import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { FEEDS, type Feed, type Region, type Topic } from "./feeds";
import { parseFeed, type ParsedItem } from "./parse";
import { combineStories, type NewsStory } from "./rank";

// Identify ourselves honestly to news sites. Deliberately generic: no personal details.
const USER_AGENT = "psnl-dashboard/0.1 (personal RSS reader)";

/**
 * Downloads and parses one feed. Cached per feed for ~30 minutes (the "news"
 * profile in next.config.ts), so page loads don't refetch anything.
 * A broken feed returns an empty list instead of breaking the page.
 */
async function getFeedItems(feed: Feed): Promise<ParsedItem[]> {
  "use cache";
  cacheLife("news");
  cacheTag("news", `news:${feed.id}`);

  try {
    const res = await fetch(feed.url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parseFeed(await res.text());
  } catch (error) {
    console.warn(`[news] ${feed.id} failed:`, error instanceof Error ? error.message : error);
    return [];
  }
}

export type NewsFilter = { topic?: Topic; region?: Region };

/** Top stories across every matching feed, newest first. */
export async function getNews(filter: NewsFilter = {}, limit = 60): Promise<NewsStory[]> {
  const feeds = FEEDS.filter(
    (f) => (!filter.topic || f.topic === filter.topic) && (!filter.region || f.region === filter.region),
  );
  // Fetch all feeds in parallel; each is cached independently
  const results = await Promise.all(feeds.map(async (feed) => ({ feed, items: await getFeedItems(feed) })));
  // When looking at a narrow filter, allow more stories from each feed
  const perFeed = feeds.length <= 4 ? 15 : 6;
  return combineStories(results, { perFeed, limit });
}

/** A balanced handful for the dashboard: the newest few from each topic. */
export async function getHeadlines(perTopic = 3): Promise<NewsStory[]> {
  const all = await getNews({}, 200);
  const byTopic = new Map<Topic, NewsStory[]>();
  for (const story of all) {
    const list = byTopic.get(story.topic) ?? [];
    if (list.length < perTopic) list.push(story);
    byTopic.set(story.topic, list);
  }
  return [...byTopic.values()].flat();
}
