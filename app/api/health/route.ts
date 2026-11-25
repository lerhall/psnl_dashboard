import { connection } from "next/server";

// GET /api/health: a tiny endpoint for checking the Pi is serving the app
// (e.g. from an uptime monitor or `curl` in a systemd watchdog script).
export async function GET() {
  // Make sure this runs per request instead of being prerendered at build time
  await connection();
  return Response.json({ ok: true, time: new Date().toISOString() });
}
