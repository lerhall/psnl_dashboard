import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components: data is dynamic by default, and we opt in to caching
  // per-function with the "use cache" directive (see lib/news, lib/calendar, lib/art).
  cacheComponents: true,
  partialPrefetching: true,

  // Custom cache lifetimes (in seconds) used by cacheLife("<name>") calls.
  // stale = how long the browser may reuse it, revalidate = when the server
  // refreshes it in the background, expire = hard limit before it must refetch.
  cacheLife: {
    // News feeds: refresh every 30 minutes so the Pi isn't hammering ~25 feeds
    news: { stale: 300, revalidate: 1800, expire: 86400 },
    // Outlook calendars: refresh every 10 minutes
    calendar: { stale: 60, revalidate: 600, expire: 3600 },
    // Daily art: the cache key includes today's date, so a long life is fine
    art: { stale: 3600, revalidate: 86400, expire: 172800 },
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
