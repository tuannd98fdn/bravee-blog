import type { Metadata } from 'next';
import styles from './til.module.css';

export const metadata: Metadata = {
  title: 'Today I Learned (TIL)',
  description: 'Short snippets, engineering notes, and bite-sized lessons learned day-to-day.',
};

interface TilEntry {
  title: string;
  tag: string;
  date: string;
  description: string;
  codeSnippet?: string;
  keyTakeaway: string;
}

const TIL_ENTRIES: TilEntry[] = [
  {
    title: 'Next.js 15 Async Request APIs (params & searchParams)',
    tag: 'Next.js',
    date: '2026-08-20',
    description: 'In Next.js 15, `params` and `searchParams` in Page components are Promises and must be awaited asynchronously to avoid build warnings.',
    codeSnippet: 'const { slug } = await params;',
    keyTakeaway: 'Always type params as Promise<{ slug: string }> in dynamic route props.',
  },
  {
    title: 'Upstash Redis Sliding Window Rate Limiting',
    tag: 'Redis / Security',
    date: '2026-08-18',
    description: 'A two-tier rate limiter (10 req/min for bursts + 30 req/hour for sustained usage) effectively prevents AI API quota exhaustion from scrapers.',
    codeSnippet: 'const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m") });',
    keyTakeaway: 'Use IP-based or session-based identifiers to isolate quotas per reader.',
  },
  {
    title: 'Anthropic Model Context Protocol (MCP) Architecture',
    tag: 'AI Engineering',
    date: '2026-08-15',
    description: 'MCP separates AI models from data sources via client-server architecture, allowing agents to query databases and execute tools securely via standard JSON-RPC.',
    codeSnippet: 'mcp-server: stdio / sse -> standardized tool schemas',
    keyTakeaway: 'Decouples tools from specific LLM SDKs, making tools reusable across Claude, Gemini, and GPT.',
  },
  {
    title: 'Dynamic OG Images with Edge ImageResponse',
    tag: 'SEO / Next.js',
    date: '2026-08-12',
    description: 'Using `@vercel/og` ImageResponse inside `src/app/og/route.tsx` allows generating SVG/PNG social preview cards at the Edge in <50ms without headless Chromium.',
    codeSnippet: 'return new ImageResponse(<div style={{...}}>...</div>, { width: 1200, height: 630 });',
    keyTakeaway: 'Zero serverless bundle bloat compared to puppeteer.',
  },
  {
    title: 'AWS IAM Policy Evaluation Logic',
    tag: 'AWS Cloud',
    date: '2026-08-10',
    description: 'An explicit Deny always overrides any Allow. If no Allow exists, the request defaults to implicit Deny across Identity-based policies and SCPs.',
    codeSnippet: 'Explicit Deny > Explicit Allow > Default Deny',
    keyTakeaway: 'When troubleshooting cross-account STS access, check Permission Boundaries and Resource Policies.',
  },
  {
    title: 'CSS Custom Property Transitions',
    tag: 'CSS / UI',
    date: '2026-08-08',
    description: 'Never hardcode hex codes inside individual CSS rules; bind theme tokens to `[data-theme="dark"]` and `[data-theme="light"]` root variables with smooth color transitions.',
    codeSnippet: 'transition: background-color var(--transition-base), color var(--transition-base);',
    keyTakeaway: 'Ensures instantaneous or smooth transitions when switching themes without FOUC.',
  },
];

export default function TilPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Today I Learned (TIL)</h1>
        <p className={styles.subtitle}>
          A micro-journal of bite-sized engineering discoveries, debugging tricks, and lessons learned while building in public.
        </p>
      </header>

      <div className={styles.grid}>
        {TIL_ENTRIES.map((entry) => (
          <article key={entry.title} className={styles.card}>
            <div className={styles.cardMeta}>
              <span className={styles.tag}>#{entry.tag}</span>
              <time className={styles.date}>{entry.date}</time>
            </div>

            <h2 className={styles.cardTitle}>{entry.title}</h2>
            <p className={styles.cardSnippet}>{entry.description}</p>

            {entry.codeSnippet && (
              <pre className={styles.codeBox}>
                <code>{entry.codeSnippet}</code>
              </pre>
            )}

            <div className={styles.footerNote}>
              💡 <strong>Takeaway:</strong> {entry.keyTakeaway}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
