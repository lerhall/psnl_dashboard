# Calendar: connecting your two Outlook calendars

The dashboard reads each calendar's **published ICS link**: a read-only feed
Outlook can generate. Nothing needs signing in, and the dashboard never writes
to your calendar.

## Getting the links (Outlook on the web / Outlook.com)

1. Go to https://outlook.live.com/calendar (personal) or
   https://outlook.office.com/calendar (work/uni account).
2. **Settings (⚙) → Calendar → Shared calendars**.
3. Under **Publish a calendar**, pick the calendar, and set permissions to
   **Can view all details** (or *Can view titles and locations* if you'd rather
   the dashboard not see descriptions).
4. Click **Publish**, then copy the **ICS** link (not the HTML one).
5. Repeat for the second calendar.

Put them in `.env.local`:

```bash
OUTLOOK_CALENDAR_1_URL=https://outlook.live.com/owa/calendar/…/calendar.ics
OUTLOOK_CALENDAR_1_NAME=Personal
OUTLOOK_CALENDAR_2_URL=https://outlook.office365.com/owa/calendar/…/calendar.ics
OUTLOOK_CALENDAR_2_NAME=Uni
```

`webcal://` links work too (they're converted to `https://` automatically).
The names are what's shown in the legend and on each event.

## How the merge works

- Both feeds are fetched (cached 10 minutes), and recurring events are expanded
  into individual occurrences. Cancelled occurrences and moved instances are
  respected.
- Events with the **same title and same start/end** in both calendars are shown
  once, marked with the accent colour and both calendar names. That covers
  meetings you're invited to from one account to the other.
- Times are shown in `DASHBOARD_TIMEZONE` (default `Europe/London`), whatever
  timezone the Pi is set to.
- The overview card shows 5 days; the Calendar page lets you pick 7/14/30/60.

## Privacy

**Treat these links like passwords.** Anyone who has one can read that
calendar. They only live in `.env.local` (git-ignored). If one leaks, go back
to *Publish a calendar*, **Reset links**, and update `.env.local`.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| "No calendars connected" | `OUTLOOK_CALENDAR_1_URL` empty, or the server wasn't restarted after editing `.env.local` |
| One calendar missing | Check the server log for `[calendar] <name> failed:`; usually a bad or reset link |
| "Publish a calendar" isn't there (work/uni account) | Your organisation's admin has disabled publishing. Options: share that calendar to your personal Outlook account and publish from there, or subscribe to it in your personal calendar |
| Changes take a while to appear | Outlook only refreshes published feeds every so often (sometimes up to a few hours), and the dashboard caches for 10 minutes on top |
| Event on the wrong day | Check `DASHBOARD_TIMEZONE` |
