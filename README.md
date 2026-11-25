# Personal dashboard

A self-hosted dashboard for a Raspberry Pi 5: news, a merged Outlook calendar,
to-dos, reminders, academic deadlines, personal alerts and daily art.

Built with Next.js 16 (App Router, Cache Components), Tailwind v4 and Supabase.

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase + Outlook links
pnpm dev
```

| Section | Page | Data |
| --- | --- | --- |
| News | `/news` | ~30 free RSS feeds, filter by topic & region |
| Calendar | `/calendar` | Two Outlook ICS links, merged |
| To-do | `/todos` | Supabase |
| Reminders | `/reminders` | Supabase, 5 importance levels |
| Academic | `/academic` | Supabase, assignments + events |
| Personal alerts | `/alerts` | Supabase: hackathons, competitions, music, deals, thrifts |
| Art | `/art` | Art Institute of Chicago + The Met APIs |

Everything else is in **[docs/](docs/README.md)**: setup, architecture, where
to find things for each section, and Pi deployment.
