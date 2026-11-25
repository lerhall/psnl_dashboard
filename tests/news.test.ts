import { describe, expect, it } from "vitest";
import type { Feed } from "@/lib/news/feeds";
import { parseFeed, toPlainText } from "@/lib/news/parse";
import { combineStories } from "@/lib/news/rank";

const rss = `<?xml version="1.0"?>
<rss version="2.0"><channel><title>Test</title>
  <item><title><![CDATA[Chip &amp; AI news]]></title><link>https://example.com/a</link>
    <pubDate>Tue, 24 Nov 2026 10:00:00 GMT</pubDate><description><![CDATA[<p>Some <b>bold</b> text&#8217;s here</p>]]></description></item>
</channel></rss>`;

const atom = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry><title type="html">Atom story</title>
    <link rel="replies" href="https://example.com/comments"/>
    <link rel="alternate" href="https://example.com/b"/>
    <published>2026-11-24T09:00:00Z</published><summary>Summary</summary></entry>
</feed>`;

const rdf = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <item><title>RDF story</title><link>https://example.com/c</link><dc:date>2026-11-24T08:00:00Z</dc:date></item>
</rdf:RDF>`;

describe("parseFeed", () => {
  it("reads RSS 2.0 with CDATA and HTML", () => {
    const [item] = parseFeed(rss);
    expect(item.title).toBe("Chip & AI news");
    expect(item.link).toBe("https://example.com/a");
    expect(item.publishedAt).toBe("2026-11-24T10:00:00.000Z");
    expect(item.summary).toBe("Some bold text’s here");
  });

  it("reads Atom and prefers the alternate link", () => {
    const [item] = parseFeed(atom);
    expect(item.title).toBe("Atom story");
    expect(item.link).toBe("https://example.com/b");
  });

  it("reads RSS 1.0 / RDF (used by DW)", () => {
    const [item] = parseFeed(rdf);
    expect(item.link).toBe("https://example.com/c");
    expect(item.publishedAt).toBe("2026-11-24T08:00:00.000Z");
  });

  it("returns nothing for junk", () => {
    expect(parseFeed("<html>not a feed</html>")).toEqual([]);
  });

  it("truncates long summaries", () => {
    expect(toPlainText("a".repeat(300), 10)).toBe(`${"a".repeat(9)}…`);
  });
});

describe("combineStories", () => {
  const feed = (id: string): Feed => ({ id, source: id, url: "", topic: "tech", region: "uk" });
  const item = (title: string, link: string, publishedAt: string) => ({ title, link, publishedAt, summary: "" });

  it("dedupes by link and headline, caps per feed, sorts newest first", () => {
    const stories = combineStories(
      [
        { feed: feed("a"), items: [item("Same story", "https://a/1", "2026-11-24T10:00:00Z"), item("Old", "https://a/2", "2026-11-20T10:00:00Z")] },
        { feed: feed("b"), items: [item("Same Story!", "https://b/1", "2026-11-24T11:00:00Z"), item("New", "https://b/2", "2026-11-24T12:00:00Z")] },
      ],
      { perFeed: 1 },
    );
    expect(stories.map((s) => s.title)).toEqual(["New", "Same story"]);
  });
});
