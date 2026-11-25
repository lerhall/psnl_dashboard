import "server-only";

import { cacheLife, cacheTag } from "next/cache";

// Daily artwork picks from two free, key-less museum APIs:
//  - Art Institute of Chicago (public-domain paintings)
//  - The Metropolitan Museum of Art (highlighted paintings)
// The pick is derived from the date, so everyone (i.e. you, on every device)
// sees the same piece all day, and it changes at midnight.

export type Artwork = {
  museum: string;
  title: string;
  artist: string;
  date: string;
  imageUrl: string;
  /** Link to the museum's page for the piece */
  pageUrl: string;
  altText: string;
};

// AIC asks API users to identify themselves; keep it generic (no personal info)
const HEADERS = { "AIC-User-Agent": "psnl-dashboard (personal project)" };

/** Turns "2026-11-24" + a salt into a stable pseudo-random number. */
export function daySeed(day: string, salt = ""): number {
  // FNV-1a hash: tiny, deterministic, good enough to spread picks around
  let hash = 0x811c9dc5;
  for (const char of `${salt}${day}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).host}`);
  return res.json() as Promise<T>;
}

/** Art Institute of Chicago: one public-domain painting, chosen by the day. */
async function pickFromAic(day: string): Promise<Artwork | null> {
  // Their search only allows paging through the first 1000 results
  const page = (daySeed(day, "aic") % 1000) + 1;
  const params = new URLSearchParams({
    "query[bool][must][0][term][is_public_domain]": "true",
    "query[bool][must][1][term][artwork_type_id]": "1", // 1 = Painting
    limit: "1",
    page: String(page),
    fields: "id,title,artist_display,date_display,image_id,thumbnail",
  });
  type AicResponse = {
    data: { id: number; title: string; artist_display: string; date_display: string; image_id: string | null; thumbnail?: { alt_text?: string } }[];
    config: { iiif_url: string };
  };
  const json = await fetchJson<AicResponse>(`https://api.artic.edu/api/v1/artworks/search?${params}`);
  const art = json.data[0];
  if (!art?.image_id) return null;
  return {
    museum: "Art Institute of Chicago",
    title: art.title,
    // artist_display is "Name (Nationality, dates)" across lines; keep the first line
    artist: art.artist_display.split("\n")[0],
    date: art.date_display,
    imageUrl: `${json.config.iiif_url}/${art.image_id}/full/843,/0/default.jpg`,
    pageUrl: `https://www.artic.edu/artworks/${art.id}`,
    altText: art.thumbnail?.alt_text ?? art.title,
  };
}

/** The Met: one highlighted painting, chosen by the day. */
async function pickFromMet(day: string): Promise<Artwork | null> {
  const base = "https://collectionapi.metmuseum.org/public/collection/v1.1";
  const query = "hasImages=true&isHighlight=true&q=painting";
  // First ask how many results there are, then jump to a day-specific one
  const { total } = await fetchJson<{ total: number }>(`${base}/search?${query}&limit=1&offset=0`);
  if (!total) return null;

  // Some objects have no public image; try a few neighbours before giving up
  for (let attempt = 0; attempt < 3; attempt++) {
    const offset = (daySeed(day, "met") + attempt) % total;
    const { objectIDs } = await fetchJson<{ objectIDs: number[] | null }>(`${base}/search?${query}&limit=1&offset=${offset}`);
    const id = objectIDs?.[0];
    if (!id) continue;

    type MetObject = { title: string; artistDisplayName: string; objectDate: string; primaryImageSmall: string; objectURL: string };
    const obj = await fetchJson<MetObject>(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
    if (!obj.primaryImageSmall) continue;
    return {
      museum: "The Met",
      title: obj.title,
      artist: obj.artistDisplayName || "Unknown artist",
      date: obj.objectDate,
      imageUrl: obj.primaryImageSmall,
      pageUrl: obj.objectURL,
      altText: obj.title,
    };
  }
  return null;
}

/**
 * Today's artworks (one per museum). Cached per day, so each museum is only
 * asked once a day. If a museum is down, its pick is just left out.
 */
export async function getDailyArt(day: string): Promise<Artwork[]> {
  "use cache";
  cacheLife("art");
  cacheTag("art");

  const picks = await Promise.allSettled([pickFromAic(day), pickFromMet(day)]);
  return picks.flatMap((p) => {
    if (p.status === "rejected") console.warn("[art]", p.reason instanceof Error ? p.reason.message : p.reason);
    return p.status === "fulfilled" && p.value ? [p.value] : [];
  });
}
