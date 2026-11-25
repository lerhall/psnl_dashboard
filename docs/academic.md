# Academic tracker

One list for everything uni-related, split on the page into:

- **Assignments, exams & deadlines**: things that are *due*. They stay
  visible (in red) when overdue until you tick them off.
- **Events**: lectures, talks, careers fairs, society events. They disappear
  from the overview once their day has passed.

## Fields

| Field | Use it for |
| --- | --- |
| Title | "CW2: Report", "Mid-term exam" |
| Type | assignment / exam / deadline / event |
| Due / starts | Date **and time**. Submission deadlines are often 12:00 or 23:59, so get the time right |
| Module / course | Module code, so you can scan by module |
| Location | Exam hall, room, or "Online" |
| Link | The brief, Moodle/Canvas page, or submission portal |
| Notes | Word count, weighting, group members… |

Badges: **red** = overdue, **orange** = today, **amber** = within 3 days.

## Habits that make it useful

- At the start of each term, go through every module handbook and add *all*
  the deadlines in one sitting. It takes 20 minutes and saves the panic.
- Add exam timetable entries as soon as they're published.
- Use the Link field for the submission page, so on the day it's one click.
- Tick things off as soon as they're submitted: the overview only shows what's
  still open.

## Automating it later

- **Your uni timetable** is very likely available as an ICS feed (look for
  "Subscribe", "Export to calendar" or "iCal" in the timetable system). Easiest
  win: subscribe to it in one of your Outlook calendars and it will show up on
  the Calendar section with no code at all.
- **Moodle** offers *Calendar → Export calendar → Get calendar URL*, which
  includes assignment due dates. **Canvas** has a "Calendar feed" link in
  Calendar. Either could be added as a third ICS source in `lib/calendar`, or
  imported into `academic_items` by a small sync script.
