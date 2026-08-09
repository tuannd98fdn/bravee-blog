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
