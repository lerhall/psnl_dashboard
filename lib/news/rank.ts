import type { Feed } from "./feeds";
import type { ParsedItem } from "./parse";

export type NewsStory = ParsedItem & Pick<Feed, "source" | "topic" | "region"> & { feedId: string };

/** Lowercased, punctuation-free title used to spot the same story twice. */
function titleKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Combines stories from many feeds into one "top stories" list:
 *  1. take only the freshest `perFeed` items from each feed, so one very
 *     chatty outlet can't drown out the rest;
 *  2. drop duplicates (same link, or same headline from a different section);
 *  3. sort newest first.
 */
export function combineStories(
  feeds: { feed: Feed; items: ParsedItem[] }[],
  { perFeed = 6, limit = 60 }: { perFeed?: number; limit?: number } = {},
): NewsStory[] {
  const seenLinks = new Set<string>();
  const seenTitles = new Set<string>();
  const combined: NewsStory[] = [];

  for (const { feed, items } of feeds) {
    const freshest = [...items]
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
      .slice(0, perFeed);

    for (const item of freshest) {
      const key = titleKey(item.title);
      if (seenLinks.has(item.link) || seenTitles.has(key)) continue;
      seenLinks.add(item.link);
      seenTitles.add(key);
      combined.push({ ...item, source: feed.source, topic: feed.topic, region: feed.region, feedId: feed.id });
    }
  }

  return combined
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, limit);
}
