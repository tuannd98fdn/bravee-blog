import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './projects.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A curated showcase of open-source tools, AI applications, and engineering projects by Bravee.',
};

interface Project {
  name: string;
  description: string;
  emoji: string;
  badge: string;
  isLive?: boolean;
  tech: string[];
  links: {
    label: string;
    href: string;
    isExternal?: boolean;
  }[];
}

const PROJECTS: Project[] = [
  {
    name: 'Bravee Blog & Engineering Hub',
    description: 'Personal technical engineering blog built with Next.js 15 App Router, MDX, and a custom dark-first design system with 3D Canvas visual and zero-cost Vercel deployment.',
    emoji: '📝',
    badge: 'Live',
    isLive: true,
    tech: ['Next.js 15', 'React 19', 'MDX', 'TypeScript', 'Three.js', 'Vercel'],
    links: [
      { label: 'GitHub Repo →', href: 'https://github.com/tuannd98fdn/bravee-blog', isExternal: true },
      { label: 'Read Story →', href: '/blog/tai-sao-toi-viet-blog' },
    ],
  },
  {
    name: 'AI RAG Assistant with Gemini 3.5',
    description: 'Interactive AI chatbot widget with client-side SSE Markdown streaming, sliding-window rate limiting on Upstash Redis, and keyword-based fuzzy RAG search across blog posts.',
    emoji: '🤖',
    badge: 'Integrated',
    isLive: true,
    tech: ['Gemini 3.5 Flash', 'Upstash Redis', 'Fuse.js', 'SSE Streaming', 'Radix UI'],
    links: [
      { label: 'Explore AI Series →', href: '/tags/ai' },
    ],
  },
  {
    name: 'Autonomous AI Agent System & Harness',
    description: 'Practical multi-agent orchestration architecture featuring ReAct prompting, loop engineering, Anthropic Model Context Protocol (MCP), and persistent memory.',
    emoji: '⚡',
    badge: 'Series Project',
    tech: ['Python', 'LangChain', 'LangGraph', 'FastAPI', 'MCP', 'Vector DB'],
    links: [
      { label: 'Read Roadmap →', href: '/blog/ai-agent-system-roadmap' },
      { label: 'Deep Dive →', href: '/blog/ai-engineer-series-phan-4-agents-autonomous-systems' },
    ],
  },
  {
    name: 'AWS Cloud Security & IAM Blueprint',
    description: 'Production-ready cloud architecture patterns covering IAM permission boundaries, cross-account STS roles, AWS Lambda microservices, and SAP-C02 compliance checklist.',
    emoji: '☁️',
    badge: 'Architecture',
    tech: ['AWS IAM', 'STS', 'CloudFormation', 'SAP-C02', 'DevOps'],
    links: [
      { label: 'Read IAM Guide →', href: '/blog/aws-iam-tu-a-den-z' },
      { label: 'SAP-C02 Overview →', href: '/blog/aws-sap-c02-overview-vi' },
    ],
  },
];

export default function ProjectsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.subtitle}>
          A collection of open-source tools, AI applications, cloud architectures, and experiments I&apos;ve built and documented.
        </p>
      </header>

      <div className={styles.grid}>
        {PROJECTS.map((project) => (
          <div key={project.name} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.icon}>{project.emoji}</span>
              <span className={`${styles.badge} ${project.isLive ? styles.badgeLive : ''}`}>
                {project.badge}
              </span>
            </div>

            <h2 className={styles.name}>{project.name}</h2>
            <p className={styles.desc}>{project.description}</p>

            <div className={styles.techList}>
              {project.tech.map((t) => (
                <span key={t} className={styles.techTag}>
                  {t}
                </span>
              ))}
            </div>

            <div className={styles.links}>
              {project.links.map((link) => (
                link.isExternal ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkBtn}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} href={link.href} className={styles.linkBtn}>
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
