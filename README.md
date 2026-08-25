# MERN stack project for crawling websites

## Save articles for later
Stop losing great reads in a sea of open tabs. Paste a link, and we'll pull the clean content, author, and publish date — ready whenever you have time to actually read it.

## Build a research library that lasts
Web pages change, get paywalled, or vanish. Save the full content once, and it's yours forever — searchable, organized, and safe from link rot.

## Track pages that matter to you
Keep an eye on competitor blogs, pricing pages, or changelogs. Save a link once and revisit it anytime — no more manually checking a dozen tabs.

## Turn links into a knowledge base
Collecting sources for a project or newsletter? Drop in URLs as you find them and come back to a clean, structured archive — no copy-pasting, no messy notes.

## Your own private reading archive
Everything you save is yours alone — a personal, searchable library of everything you've read, tied to your account, not scattered across bookmarks and browser history.

### Roadmap:

- [ ] backend (Express.js)
  - [x] setup backend with bun
  - [x] setup auth with clerk
  - [x] setup database with mongoose
  - [x] create clerk webhook to save users in db

- [ ] frontend (Next.js)
  - [x] setup frontend
  - [x] init shadcn
  - [x] setup auth with clerk

- [x]: setup firecrawl in backend to scrape a url with refetch
- [x]: test firecrawl in backend using INSOMNIA (CRUD)
- [x]: create ui in frontend to search blogs/articles using link
- [x]: create ui in frontend to display crawled data (List + id page)

- [ ]: DEPLOY

- [ ]: add bulk crawl feature to backend (scrape multiple urls at once)
- [ ]: create ui in frontend to search blogs/articles link and search query
- [ ]: implement AI sdk to summarize the content and generate tags.
