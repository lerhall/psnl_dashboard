import { XMLParser } from "fast-xml-parser";

// Turns raw RSS 2.0 / Atom / RSS 1.0 (RDF) XML into a flat list of items.
// Kept free of Next.js imports so it can be unit tested on its own.

export type ParsedItem = {
  title: string;
  link: string;
  /** ISO timestamp, or null if the feed didn't give a usable date */
  publishedAt: string | null;
  /** Plain-text summary (HTML stripped, trimmed to ~240 chars) */
  summary: string;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  // Always give us arrays for repeated elements, even if a feed has one item
  isArray: (name) => ["item", "entry", "link"].includes(name),
});

/** Feeds put text in strings, numbers, CDATA objects or {#text}; normalise it. */
function text(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return text(value[0]);
  if (typeof value === "object" && "#text" in value) return text((value as { "#text": unknown })["#text"]);
  return "";
}

/** Decodes the HTML entities that commonly leak through feed titles. */
export function decodeEntities(input: string): string {
  const named: Record<string, string> = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
    rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
    ndash: "–", mdash: "—", hellip: "…", pound: "£", euro: "€",
  };
  return input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match);
}

/** Strips tags + entities and collapses whitespace, then truncates. */
export function toPlainText(html: string, maxLength = 240): string {
  const plain = decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
  return plain.length > maxLength ? `${plain.slice(0, maxLength - 1).trimEnd()}…` : plain;
}

/** Parses any date string a feed might use into ISO, or null. */
function toISO(value: unknown): string | null {
  const raw = text(value).trim();
  if (!raw) return null;
  const ms = Date.parse(raw);
  return Number.isNaN(ms) ? null : new Date(ms).toISOString();
}

/** Atom links are elements with href attributes; prefer rel="alternate". */
function atomLink(links: unknown): string {
  if (!Array.isArray(links)) return text(links);
  const withHref = links.filter((l) => typeof l === "object" && l && "@_href" in l) as Record<string, string>[];
  const alternate = withHref.find((l) => !l["@_rel"] || l["@_rel"] === "alternate");
  return (alternate ?? withHref[0])?.["@_href"] ?? text(links[0]);
}

export function parseFeed(xml: string): ParsedItem[] {
  const doc = parser.parse(xml);

  // Work out which flavour of feed this is and grab its raw entries
  let raw: Record<string, unknown>[] = [];
  let isAtom = false;
  if (doc?.rss?.channel) {
    raw = doc.rss.channel.item ?? [];
  } else if (doc?.feed) {
    raw = doc.feed.entry ?? [];
    isAtom = true;
  } else if (doc?.["rdf:RDF"]) {
    raw = doc["rdf:RDF"].item ?? [];
  }

  return raw
    .map((entry): ParsedItem => {
      const link = isAtom ? atomLink(entry.link) : text(entry.link) || text(entry.guid);
      const summarySource = text(entry.description) || text(entry.summary) || text(entry.content);
      return {
        title: toPlainText(text(entry.title), 300),
        link: link.trim(),
        publishedAt: toISO(entry.pubDate ?? entry.published ?? entry.updated ?? entry["dc:date"]),
        summary: toPlainText(summarySource),
      };
    })
    .filter((item) => item.title && item.link.startsWith("http"));
}
