import path from "node:path";
import { defineConfig } from "vitest/config";

// Unit tests for the pure logic in lib/ (date maths, feed parsing, calendar merging).
export default defineConfig({
  resolve: {
    // Mirror the "@/..." import alias from tsconfig.json
    alias: { "@": path.resolve(import.meta.dirname) },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    // Pin the timezone so date tests behave the same on any machine
    env: { TZ: "Europe/London", DASHBOARD_TIMEZONE: "Europe/London" },
  },
});
