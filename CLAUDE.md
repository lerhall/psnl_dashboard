# Project

This is a Next.js app using the App Router, Tailwind, and Supabase (Postgres via @supabase/supabase-js). it is a personal dashboard that will display useful informaiton for me. It will be hosted on my raspberry pi5

## Commands
- Dev server: `pnpm dev`
- Run tests: `pnpm test`
- Lint: `pnpm lint`

## Code Style
- Use 2-space indentation
- Prefer named exports
- All API routes go in app/api/
- Use server actions instead of API routes where possible
- Use comments to explain exactly what is happening frequently

## Specification
- This project is intended as a personal dashboard which will display multiple features, some more complex than others. News, calendar, personal to do list, academia/upcoming assignments and competitions, a personal updates section, art section. These should be on one dashboard and for ones that I can expand, should be different pages for me to look at them.

### News
- I want news stories from tech, finance, politics and climate from the UK EU, USA, China, and globally. I want to compile the top stories from a variety of news sites that are relevant to these. The sites should be free to access or have free options.

### Calendar
- The calendar will be linked to my personal outlook calendars and combine them, there will be two, so find a way to combine the events and present them in a nice format. I will provide a link to be accessed from a .env file

### To do list
- This will be a basic list where I can add tasks and their due dates

### Reminders
- This will be another basic list where I can add tasks and add a vague level of importance from unimportant to crucial, say about 5 levels

### Academic updates
- This will be like another list but for academic assignments and their due dates, and will also have events there too

### Personal alerts
- This will have things such as
- Hackathons
- Competitions
- Announcements on music or deals
- Local thrifts
- Other things i may find interesting

### Art
- Daily pieces of art from certain sites to give me some inspiration and a nice pretty page. 
## Notes for agents
- Next.js 16 with Cache Components: see @AGENTS.md before writing Next.js code.
- Reference docs for each section live in docs/ (start at docs/README.md).
