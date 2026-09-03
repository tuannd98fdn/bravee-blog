# Decision Log

## Decision #1: MDX-native "Leerob Way"
- **Date**: 2026-08-08
- **Context**: Choose content management strategy
- **Decision**: MDX files in repo, no CMS, no database
- **Alternatives**: Full-Stack Lite (MDX + Supabase), Headless CMS (Contentful/Sanity)
- **Reason**: Zero-cost, Git-native version control, proven pattern (leerob.io), easy to upgrade later

## Decision #2: Folder-based i18n
- **Date**: 2026-08-08
- **Context**: How to handle bilingual content (Vietnamese + English)
- **Decision**: Separate subfolders (`content/blog/vi/`, `content/blog/en/`)
- **Alternatives**: next-intl routing, single folder with lang prefix
- **Reason**: Simple, no extra dependency, author writes in chosen language per post

## Decision #3: Dark-first premium design
- **Date**: 2026-08-08
- **Context**: Choose UI/UX direction
- **Decision**: Dark theme default, Inter + JetBrains Mono, blue→purple accent
- **Alternatives**: Glassmorphism, bold/colorful, clean minimalist
- **Reason**: Premium feel, optimized for code reading, matches Vercel/Linear benchmark

## Decision #4: 672px content width with progress bar
- **Date**: 2026-08-08
- **Context**: Blog post reading experience
- **Decision**: 672px max-width content, reading progress bar, sticky TOC on desktop
- **Alternatives**: Full-width, fixed sidebar TOC
- **Reason**: Optimal reading line length, premium blog UX

## Decision #5: 4-phase rollout
- **Date**: 2026-08-08
- **Context**: Feature prioritization and timeline
- **Decision**: Phase 1 (core blog), Phase 2 (engagement), Phase 3 (differentiation), Phase 4 (scale)
- **Alternatives**: All-in-one launch, 2-phase only
- **Reason**: Reduce risk, ship early, iterate based on real feedback

## Decision #6: 4-file AI tracking system
- **Date**: 2026-08-08
- **Context**: Prevent AI context loss between sessions
- **Decision**: `.agents/` folder with ARCHITECTURE.md, DECISION_LOG.md, PROGRESS.md, AGENTS.md
- **Alternatives**: Single README, external tool
- **Reason**: Lightweight, Git-native, AI reads automatically per session

## Decision #7: Keyword-based RAG prompt injection instead of Tool Calling
- **Date**: 2026-08-09
- **Context**: Gemini 3.5 requires `thought_signature` when calling tools, which crashes in older AI SDK versions.
- **Decision**: Replaced all Tool Calling with keyword-based fuzzy search RAG using Fuse.js. Relevant post descriptions and summaries are dynamically injected into the system prompt.
- **Alternatives**: Upgrade Vercel AI SDK to v4 (blocked by Next.js 16.3 / React 19 Turbopack build type mismatch errors).
- **Reason**: 100% reliable, zero thought_signature errors, faster response times, and retains post-discovery capabilities.

## Decision #8: Lightweight hand-rolled SSE and Markdown parser
- **Date**: 2026-08-09
- **Context**: Integrating Vercel AI SDK client hooks (`useChat` from `@ai-sdk/react` or `ai/react`) caused build and runtime errors (e.g. Hooks order mismatch under HMR, undefined input properties).
- **Decision**: Hand-rolled a custom fetch implementation with manual SSE parser and a lightweight markdown renderer (handling lists, links, strong, em).
- **Alternatives**: Pinned library downgrades or full page reloads.
- **Reason**: Eliminates dependency fragility, solves Turbopack HMR bugs, compiles instantly, and stays extremely lightweight.

## Decision #9: Two-tier Upstash Redis rate limiting
- **Date**: 2026-08-09
- **Context**: Prevent API key exhaustion on the public blog.
- **Decision**: Implemented two ratelimiters (10 requests per minute sliding window for burst, 30 requests per hour sliding window for daily usage).
- **Alternatives**: Simple per-minute limits, client-side block.
- **Reason**: Robust protection against fast spam bots and sustained programmatic abuse, ensuring API keys remain within quota for regular readers.

## Decision #10: Dynamic brand logo Favicon using Next.js icon.tsx
- **Date**: 2026-08-09
- **Context**: Replace the default Vercel favicon with the site's brand logo icon.
- **Decision**: Added `src/app/icon.tsx` using `next/og` ImageResponse to dynamically generate a 32x32 PNG favicon matching the header logo's blue-to-purple gradient and centered "B" letter, and deleted the default `src/app/favicon.ico`.
- **Alternatives**: Pre-compiled custom `favicon.ico` or static PNG file.
- **Reason**: Dynamic generation guarantees consistency with the header style variables (gradient colors), stays crisp at all screen resolutions, and aligns with modern Next.js metadata practices.

## Decision #11: Series Navigation Component and Dedicated Hub Pages
- **Date**: 2026-09-02
- **Context**: Multi-part articles (AI Engineer, LangChain, AWS) were hard to discover and browse in sequence, and `/projects`, `/tutorials`, `/til` routes were unpopulated placeholders.
- **Decision**: Added `<SeriesBox />` navigation component to article detail pages, grouped topic categories and bilingual filters on `/blog`, and converted placeholder pages (`/projects`, `/tutorials`, `/til`) into fully designed showcases styled with CSS Modules.
- **Alternatives**: Leaving placeholder text until future versions or route-based i18n restructuring.
- **Reason**: Greatly improves content discoverability, sequential learning journey, retention, and delivers a complete, polished website experience.

## Decision #12: Dedicated System Design content track & DDD architectural foundation
- **Date**: 2026-09-03
- **Context**: Expand the blog's technical depth into core enterprise software engineering, specifically Domain-Driven Design (DDD) as requested, mapping video chapters into an exhaustive, high-signal guide.
- **Decision**: Created `content/blog/vi/system-design/` directory and published "Domain-Driven Design (DDD): Tất Tần Tật Những Gì Bạn Cần Biết Trong Kỷ Nguyên System Design", synthesizing Strategic Design (Core/Supporting/Generic Subdomains, Ubiquitous Language, Bounded Contexts, Context Mapping, ACL) and Tactical Design (Entities, Value Objects, Aggregates & Invariants, Repositories, Domain Services, Hexagonal Architecture) with concrete industry case studies (Netflix, Real Estate vs. E-commerce).
- **Alternatives**: Publishing as a generic overview without tactical code examples or keeping it under general category.
- **Reason**: Enhances the blog's positioning as an elite senior engineering resource; provides immediate practical utility for backend and microservices architects.




