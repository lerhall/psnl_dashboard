# Personal alerts: where to look

The Alerts page is a manual board: when you spot something worth tracking,
add it with a category, date and link, then archive it once it's done or past.
This file is the "where to spot things" list. Check these sites regularly, or
subscribe to their emails / RSS so things come to you.

> Links were correct when written; check them before relying on any of them.

## Hackathons

| Where | Notes |
| --- | --- |
| [MLH events](https://mlh.io/seasons) | Major League Hacking: the main student hackathon season list, filterable to UK/Europe & in-person |
| [Devpost](https://devpost.com/hackathons) | Online + in-person, often with prizes; filter by "Open" |
| [Hack Club](https://hackclub.com/) | Teen/student-run events and programmes |
| [Encode Club](https://www.encode.club/) | London-based hackathons & bootcamps, often AI/crypto-sponsored |
| [lu.ma](https://lu.ma/london) | Lots of London tech meetups and hack nights are posted here |
| Your uni's Computing/Hack society | Usually runs its own annual hackathon and shares others |

## Competitions

| Where | What |
| --- | --- |
| [Kaggle](https://www.kaggle.com/competitions) | Data science / ML |
| [Advent of Code](https://adventofcode.com/) | Daily puzzles 1–25 December; great with friends' private leaderboards |
| [Codeforces](https://codeforces.com/contests) / [LeetCode contests](https://leetcode.com/contest/) | Competitive programming, weekly |
| [ICPC](https://icpc.global/) / [UKIEPC](https://ukiepc.info/) | University team programming contests (via your uni) |
| [CTFtime](https://ctftime.org/event/list/upcoming) | Calendar of security capture-the-flag events |
| Writing/art/photography | Check your uni's Students' Union and local councils for creative competitions |

## Music announcements

- **Songkick** or **Bandsintown**: follow artists (or connect Spotify) and you
  get emails when they announce gigs near you.
- **DICE**: the London/indie gig app; follow venues and artists.
- **Ticketmaster / AXS artist alerts**: register interest for presale codes.
- **Spotify Release Radar** (Fridays) for new music.
- Venues' own newsletters for small gigs that never hit the big sites.

Tip: add presale dates as alerts with the presale *date*, not the gig date, so
the badge turns red on the day you need to act.

## Deals

| Where | Good for |
| --- | --- |
| [hotukdeals](https://www.hotukdeals.com/) | Community-voted UK deals; set keyword alerts |
| [UNiDAYS](https://www.myunidays.com/) / [Student Beans](https://www.studentbeans.com/) / TOTUM | Student discounts |
| [camelcamelcamel](https://uk.camelcamelcamel.com/) | Amazon UK price history + price-drop emails |
| [PriceSpy](https://pricespy.co.uk/) | Price history across UK retailers |
| Apple/Samsung education stores | Student pricing on tech |

## Local thrifts

- **Charity shops**: note the good ones' restock days (often Monday/Saturday).
- **Car boot sales**: listings sites cover most of the UK; summer Sunday mornings.
- **Vintage kilo sales / pop-up markets**: usually announced on Instagram and
  Eventbrite a couple of weeks ahead.
- **Vinted, Depop, eBay ("collection only" + nearby), Facebook Marketplace**
  for online second-hand; set saved searches for specific items.
- Uni **end-of-year / move-out sales**, where students sell furniture cheap.

## Keep a list of your own favourites

Add sources you discover below so they're all in one place:

- …
- …

## Automating it later

Several of these have feeds the dashboard could pull in automatically, the
same way the News section works:

- Devpost and MLH pages can be scraped (check their terms first).
- CTFtime has an [API](https://ctftime.org/api/).
- Kaggle has an official API (needs a free key).
- hotukdeals supports RSS for searches.

A good pattern: an `alerts_sources` table, plus a scheduled job (cron on the Pi,
or a Supabase scheduled function) that inserts new items into `alerts` for you
to triage.
