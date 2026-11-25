# News sources

All feeds are free RSS/Atom with no paywall or API key. The list lives in
`lib/news/feeds.ts`. Each feed is tagged with one **topic** and one **region**,
and those tags drive the filters on the News page.

## In use (all checked working, Nov 2026)

| Topic | UK | EU | USA | China | Global |
| --- | --- | --- | --- | --- | --- |
| **Tech** | BBC Technology | Tech.eu, Sifted | Ars Technica, The Verge | SCMP Tech | TechCrunch |
| **Finance** | BBC Business | France 24 Business | CNBC Top News, MarketWatch | SCMP Business | CNBC Finance |
| **Politics** | BBC Politics | BBC Europe, Euractiv, France 24 Europe | NPR Politics, BBC US & Canada | SCMP China, BBC China, Sixth Tone | BBC World, Al Jazeera, DW |
| **Climate** | BBC Science & Environment | France 24 Environment | Inside Climate News, Grist | Dialogue Earth | Carbon Brief |

A note on balance: SCMP is Hong Kong-based (Alibaba-owned), and Sixth Tone is
Shanghai-based and state-affiliated. Reading both alongside the BBC's China
coverage gives a fuller picture than any one of them alone.

## How "top stories" are picked

There's no single "importance" score in RSS, so the dashboard approximates one
(`lib/news/rank.ts`):

1. Take only the freshest 6 items from each feed (15 when the filter is
   narrow), so a high-volume feed like Euractiv can't drown everything out.
2. Drop duplicates (same link, or the same headline in two sections).
3. Sort newest first.

The overview card shows the newest 3 per topic.

## Tried and rejected

These returned `403` / `406` to an RSS reader, so they've been left out rather
than worked around:

- **The Guardian** (`theguardian.com/*/rss`): blocks non-browser clients. The
  free [Guardian Open Platform API](https://open-platform.theguardian.com/)
  (needs a free key) is the proper way in if you want it.
- **Politico Europe** (`politico.eu/feed`)
- **Euronews** (`euronews.com/rss?...`)
- **Reuters**: no public RSS any more.
- **FT, Economist, Bloomberg, WSJ**: paywalled.
- **The Met's old `/v1/search`** (for art, not news) was retired 2026-10-01;
  the code uses `/v1.1/search`.

## Adding a feed

1. Find the RSS link (often `/feed`, `/rss` or `/rss.xml`, or look for
   `<link type="application/rss+xml">` in the page source).
2. Check it: `curl -sL -A "psnl-dashboard/0.1 (personal RSS reader)" <url> | head`
3. Add a line to `FEEDS` in `lib/news/feeds.ts` with a unique `id`, a topic
   and a region.

If a feed later breaks, it just goes quiet (logged as `[news] <id> failed:`);
the rest still load.

## Ideas for later

- Hacker News front page: `https://hnrss.org/frontpage`
- Topic-specific Google News RSS:
  `https://news.google.com/rss/search?q=<query>&hl=en-GB&gl=GB&ceid=GB:en`
- Clustering: group stories whose headlines overlap heavily across outlets,
  and rank clusters by how many sources cover them. That's a better
  "top story" signal than recency.
