# Dashboard docs

Reference notes for each part of the dashboard. Start with **setup**, then dip
into a section's file when you want to change or extend it.

| File | What's in it |
| --- | --- |
| [architecture.md](architecture.md) | How the app is put together: folders, data flow, caching |
| [supabase.md](supabase.md) | Creating the database and connecting it |
| [calendar.md](calendar.md) | Getting the two Outlook ICS links, privacy, troubleshooting |
| [news-sources.md](news-sources.md) | Every feed in use, what was rejected and why, how to add one |
| [personal-alerts.md](personal-alerts.md) | Where to find hackathons, competitions, music news, deals and thrifts |
| [academic.md](academic.md) | How to use the academic tracker, plus ideas for automating it |
| [todos-and-reminders.md](todos-and-reminders.md) | When to use which list, and what the importance levels mean |
| [art.md](art.md) | Where the daily art comes from and other museums you could add |
| [deployment-raspberry-pi.md](deployment-raspberry-pi.md) | Running it 24/7 on the Pi 5 |

## Quick setup

```bash
pnpm install
cp .env.example .env.local    # then fill it in (see supabase.md + calendar.md)
pnpm dev                      # http://localhost:3000
```

Without `.env.local` the news and art sections still work; the lists and
calendar show a message telling you what's missing.
