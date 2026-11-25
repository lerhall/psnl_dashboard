import { Card, Empty } from "@/components/ui";
import { timeAgo } from "@/lib/dates";
import { TOPIC_LABELS } from "@/lib/news/feeds";
import { getHeadlines } from "@/lib/news";
import { getToday } from "@/lib/today";

/** Compact card: the newest story from each of the 4 topics. */
export async function NewsWidget() {
  // perTopic = 1 → one story each from tech, finance, politics and climate
  const [{ now }, stories] = await Promise.all([getToday(), getHeadlines(1)]);

  return (
    <Card title="News" href="/news">
      {stories.length === 0 ? (
        <Empty>No stories could be loaded right now.</Empty>
      ) : (
        <ul className="space-y-3">
          {stories.slice(0, 4).map((story) => (
            <li key={story.link}>
              <a href={story.link} target="_blank" rel="noreferrer" className="group block">
                <p className="text-xs text-muted">
                  <span className="font-medium text-accent">{TOPIC_LABELS[story.topic]}</span> · {story.source}
                  {story.publishedAt && ` · ${timeAgo(story.publishedAt, now)}`}
                </p>
                <p className="line-clamp-2 text-sm font-medium group-hover:underline">{story.title}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
