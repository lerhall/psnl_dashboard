// The news sources the dashboard pulls from. All are free RSS/Atom feeds that
// were checked working in Nov 2026. Add, remove or re-tag feeds here; see
// docs/news-sources.md for alternatives and notes on sources that block readers.

export const TOPICS = ["tech", "finance", "politics", "climate"] as const;
export type Topic = (typeof TOPICS)[number];

export const REGIONS = ["uk", "eu", "usa", "china", "global"] as const;
export type Region = (typeof REGIONS)[number];

export const TOPIC_LABELS: Record<Topic, string> = {
  tech: "Tech",
  finance: "Finance",
  politics: "Politics",
  climate: "Climate",
};

export const REGION_LABELS: Record<Region, string> = {
  uk: "UK",
  eu: "EU",
  usa: "USA",
  china: "China",
  global: "Global",
};

export type Feed = {
  /** Stable id, also used as part of the cache key */
  id: string;
  /** Outlet name shown next to each story */
  source: string;
  url: string;
  topic: Topic;
  region: Region;
};

export const FEEDS: Feed[] = [
  // --- Tech -----------------------------------------------------------------
  { id: "bbc-tech", source: "BBC", url: "https://feeds.bbci.co.uk/news/technology/rss.xml", topic: "tech", region: "uk" },
  { id: "tech-eu", source: "Tech.eu", url: "https://tech.eu/feed/", topic: "tech", region: "eu" },
  { id: "sifted", source: "Sifted", url: "https://sifted.eu/feed", topic: "tech", region: "eu" },
  { id: "ars", source: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", topic: "tech", region: "usa" },
  { id: "verge", source: "The Verge", url: "https://www.theverge.com/rss/index.xml", topic: "tech", region: "usa" },
  { id: "scmp-tech", source: "SCMP", url: "https://www.scmp.com/rss/36/feed", topic: "tech", region: "china" },
  { id: "techcrunch", source: "TechCrunch", url: "https://techcrunch.com/feed/", topic: "tech", region: "global" },

  // --- Finance --------------------------------------------------------------
  { id: "bbc-business", source: "BBC", url: "https://feeds.bbci.co.uk/news/business/rss.xml", topic: "finance", region: "uk" },
  { id: "f24-business", source: "France 24", url: "https://www.france24.com/en/business/rss", topic: "finance", region: "eu" },
  { id: "cnbc-top", source: "CNBC", url: "https://www.cnbc.com/id/100003114/device/rss/rss.html", topic: "finance", region: "usa" },
  { id: "marketwatch", source: "MarketWatch", url: "https://feeds.content.dowjones.io/public/rss/mw_topstories", topic: "finance", region: "usa" },
  { id: "scmp-business", source: "SCMP", url: "https://www.scmp.com/rss/92/feed", topic: "finance", region: "china" },
  { id: "cnbc-finance", source: "CNBC", url: "https://www.cnbc.com/id/10000664/device/rss/rss.html", topic: "finance", region: "global" },

  // --- Politics -------------------------------------------------------------
  { id: "bbc-politics", source: "BBC", url: "https://feeds.bbci.co.uk/news/politics/rss.xml", topic: "politics", region: "uk" },
  { id: "bbc-europe", source: "BBC", url: "https://feeds.bbci.co.uk/news/world/europe/rss.xml", topic: "politics", region: "eu" },
  { id: "euractiv", source: "Euractiv", url: "https://www.euractiv.com/feed/", topic: "politics", region: "eu" },
  { id: "f24-europe", source: "France 24", url: "https://www.france24.com/en/europe/rss", topic: "politics", region: "eu" },
  { id: "npr-politics", source: "NPR", url: "https://feeds.npr.org/1014/rss.xml", topic: "politics", region: "usa" },
  { id: "bbc-us", source: "BBC", url: "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml", topic: "politics", region: "usa" },
  { id: "scmp-china", source: "SCMP", url: "https://www.scmp.com/rss/4/feed", topic: "politics", region: "china" },
  { id: "bbc-china", source: "BBC", url: "https://feeds.bbci.co.uk/news/world/asia/china/rss.xml", topic: "politics", region: "china" },
  { id: "sixth-tone", source: "Sixth Tone", url: "https://www.sixthtone.com/rss", topic: "politics", region: "china" },
  { id: "bbc-world", source: "BBC", url: "https://feeds.bbci.co.uk/news/world/rss.xml", topic: "politics", region: "global" },
  { id: "aljazeera", source: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", topic: "politics", region: "global" },
  { id: "dw", source: "DW", url: "https://rss.dw.com/rdf/rss-en-all", topic: "politics", region: "global" },

  // --- Climate --------------------------------------------------------------
  { id: "bbc-science", source: "BBC", url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", topic: "climate", region: "uk" },
  { id: "f24-environment", source: "France 24", url: "https://www.france24.com/en/environment/rss", topic: "climate", region: "eu" },
  { id: "inside-climate", source: "Inside Climate News", url: "https://insideclimatenews.org/feed/", topic: "climate", region: "usa" },
  { id: "grist", source: "Grist", url: "https://grist.org/feed/", topic: "climate", region: "usa" },
  { id: "dialogue-earth", source: "Dialogue Earth", url: "https://dialogue.earth/en/feed/", topic: "climate", region: "china" },
  { id: "carbon-brief", source: "Carbon Brief", url: "https://www.carbonbrief.org/feed/", topic: "climate", region: "global" },
];
