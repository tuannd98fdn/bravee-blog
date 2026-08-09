import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import styles from './page.module.css';

const CURRENT_LEARNING = 'AI Agents & LangGraph';

const ROADMAP_TOPICS = [
  { name: 'AI & ML', emoji: '🤖', color: '#8B5CF6', comingSoon: false },
  { name: 'AWS Cloud', emoji: '☁️', color: '#F59E0B', comingSoon: true },
  { name: 'Java', emoji: '☕', color: '#EF4444', comingSoon: true },
  { name: 'Angular', emoji: '🅰️', color: '#DD0031', comingSoon: true },
  { name: 'System Design', emoji: '🏗️', color: '#10B981', comingSoon: true },
];

export default function HomePage() {
  const posts = getAllPosts();
  const latestPosts = posts.slice(0, 5);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.greeting}>
            <span className={styles.wave}>👋</span>
            <span className={styles.greetingText}>Hey, I&apos;m</span>
          </div>
          <h1 className={styles.name}>Bravee</h1>
          <p className={styles.bio}>
            Full-stack developer on a journey from junior to senior. 
            I write about <strong>AI</strong>, <strong>Cloud</strong>, <strong>Java</strong>, 
            and everything I learn along the way.
          </p>
          <div className={styles.status}>
            <span className={styles.statusDot} />
            <span className={styles.statusLabel}>Currently learning:</span>
            <span className={styles.statusValue}>{CURRENT_LEARNING}</span>
          </div>
          <div className={styles.heroCta}>
            <Link href="/blog" className="btn btn-primary">
              Read the blog
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="/about" className="btn btn-ghost">
              About me
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.codeWindow}>
            <div className={styles.codeWindowHeader}>
              <span className={styles.dot} style={{ background: '#FF5F57' }} />
              <span className={styles.dot} style={{ background: '#FEBC2E' }} />
              <span className={styles.dot} style={{ background: '#28C840' }} />
              <span className={styles.codeWindowTitle}>bravee.ts</span>
            </div>
            <pre className={styles.codeContent}>
              <code>{`const bravee = {
  role: "Full-Stack Dev",
  learning: [
    "AI Agents",
    "AWS Cloud",
    "System Design"
  ],
  goal: "Senior Engineer",
  motto: "Learn → Build → Share"
};`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionEmoji}>📝</span>
            Latest Posts
          </h2>
          <Link href="/blog" className={`${styles.viewAll} link-animated`}>
            View all posts →
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className={`${styles.postList} stagger-children`}>
            {latestPosts.map((post) => (
              <Link 
                href={`/blog/${post.slug}`} 
                key={post.slug}
                className={styles.postCard}
              >
                <div className={styles.postMeta}>
                  <time className={styles.postDate}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                  <span className={styles.postReadTime}>{post.readingTime}</span>
                </div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postDescription}>{post.description}</p>
                <div className={styles.postTags}>
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyIcon}>✍️</p>
            <p className={styles.emptyText}>
              First post coming soon! I&apos;m working on something great.
            </p>
          </div>
        )}
      </section>

      {/* Learning Roadmaps */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionEmoji}>🗺️</span>
            Learning Roadmaps
          </h2>
        </div>
        <div className={styles.roadmapGrid}>
          {ROADMAP_TOPICS.map((topic) => (
            <div
              key={topic.name}
              className={styles.roadmapCard}
              style={{ '--card-accent': topic.color } as React.CSSProperties}
            >
              <span className={styles.roadmapEmoji}>{topic.emoji}</span>
              <span className={styles.roadmapName}>{topic.name}</span>
              {topic.comingSoon && (
                <span className={styles.comingSoon}>Coming Soon</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionEmoji}>🚀</span>
            Projects
          </h2>
          <Link href="/projects" className={`${styles.viewAll} link-animated`}>
            View all →
          </Link>
        </div>
        <div className={styles.projectGrid}>
          <div className={styles.projectCard}>
            <div className={styles.projectIcon}>📝</div>
            <h3 className={styles.projectName}>Bravee Blog</h3>
            <p className={styles.projectDesc}>
              This blog — built with Next.js, MDX, and deployed on Vercel. 
              Dark-first premium design.
            </p>
            <div className={styles.projectTech}>
              <span className="tag">Next.js</span>
              <span className="tag">MDX</span>
              <span className="tag">Vercel</span>
            </div>
          </div>
          <div className={`${styles.projectCard} ${styles.projectCardEmpty}`}>
            <div className={styles.projectIcon}>🔮</div>
            <h3 className={styles.projectName}>More coming soon...</h3>
            <p className={styles.projectDesc}>
              Building in public. Stay tuned for upcoming projects.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
