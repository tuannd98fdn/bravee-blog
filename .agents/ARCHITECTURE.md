# Bravee Blog — Architecture

> **READ THIS FIRST** every session. This is the source of truth for the project.

## Tech Stack

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Framework | Next.js (App Router) | 15.x | SSR/SSG, SEO, React ecosystem |
| Language | TypeScript | 5.x | Type safety |
| Content | MDX (next-mdx-remote) | latest | Markdown + JSX components |
| Styling | Vanilla CSS (CSS Variables) | — | Full control, no framework lock-in |
| Search | Fuse.js | latest | Client-side fuzzy search |
| Code Highlighting | rehype-pretty-code + Shiki | latest | Beautiful syntax highlighting |
| Fonts | Inter + JetBrains Mono | Google Fonts | Premium typography |
| Deploy | Vercel (project: `tuannd`) | — | Free tier, auto CI/CD — https://tuannd.vercel.app |
| Content Parsing | gray-matter + reading-time | — | Frontmatter + read time |

## Folder Structure

```
bravee-blog/
├── .agents/              # AI tracking (this folder)
├── content/              # MDX content files
│   ├── blog/en/          # English blog posts
│   ├── blog/vi/          # Vietnamese blog posts
│   ├── til/              # Today I Learned (short posts)
│   └── projects/         # Project showcase data
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/
│   │   ├── ui/           # Primitives (Button, Tag, Card)
│   │   ├── layout/       # Header, Footer, Nav
│   │   ├── mdx/          # MDX custom components
│   │   └── features/     # Feature components (Search, TOC)
│   ├── lib/              # Utility functions
│   └── styles/           # CSS files
├── public/               # Static assets
└── next.config.ts        # Next.js config
```

## Design System

### Colors (Dark-first)
- Background: `#0A0A0B` (primary), `#141415` (surface), `#1A1A1C` (tertiary)
- Text: `#EDEDEF` (primary), `#8B8B8D` (secondary)
- Accent: `#3B82F6` → `#8B5CF6` (blue → purple gradient)
- Border: `#1F1F23`

### Typography
- Sans: Inter (body text)
- Mono: JetBrains Mono (code)
- Content max-width: 672px

### Design Principles
- Dark-first premium (benchmark: Vercel, Linear, Raycast)
- Typography-first — rhythm and breathing space
- NOT "AI-generated looking" — hand-crafted feel
- Micro-interactions: subtle, purposeful

## Naming Conventions

- Components: PascalCase (`Header.tsx`, `BlogCard.tsx`)
- Utilities: camelCase (`mdx.ts`, `search.ts`)
- CSS: kebab-case for custom properties (`--bg-primary`)
- Content: kebab-case (`hello-world.mdx`)
- Pages: Next.js App Router convention (`page.tsx`, `layout.tsx`)

## Key Patterns

- **Content fetching**: `lib/mdx.ts` reads from `content/` directory at build time
- **Theming**: CSS variables + `data-theme` attribute on `<html>`
- **i18n**: Folder-based (`content/blog/en/`, `content/blog/vi/`), not route-based
- **SEO**: `generateMetadata()` on every page, auto sitemap
- **MDX**: Processed via `next-mdx-remote` with custom components
