# AI Agent Rules — Bravee Blog

## Session Start Protocol
1. Read `ARCHITECTURE.md` — understand the project
2. Read `PROGRESS.md` — know where we are
3. Read `DECISION_LOG.md` — know what was decided
4. Begin work

## Session End Protocol
1. Update `PROGRESS.md` with completed/in-progress items
2. Add any new decisions to `DECISION_LOG.md`
3. Update `ARCHITECTURE.md` if structure changed

## Rules
- **Never** change design system tokens (colors, fonts, spacing) without user confirmation
- **Never** add new dependencies without documenting in ARCHITECTURE.md
- **Never** skip the session start protocol
- **Always** follow naming conventions in ARCHITECTURE.md
- **Always** use CSS variables from globals.css, never hardcode colors
- **Always** ensure dark mode works for every component
- **Always** write semantic HTML and maintain accessibility
- **Always** use `generateMetadata()` for SEO on every page

## Content Conventions
- MDX frontmatter must include: title, date, description, tags, lang
- Slugs are kebab-case, derived from filename
- Images go in `public/images/blog/[slug]/`

## Code Conventions
- Functional components only (no class components)
- Use TypeScript strict mode
- CSS Modules or global CSS variables (no inline styles)
- Server Components by default, `'use client'` only when needed
