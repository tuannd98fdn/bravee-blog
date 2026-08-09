import type { Metadata } from 'next';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: 'Full-stack developer on a journey from junior to senior. I share what I learn about AI, Cloud, Java, Angular, and software engineering.',
};

const TECH_STACK = [
  { name: 'Java', icon: '☕' },
  { name: 'Angular', icon: '🅰️' },
  { name: 'TypeScript', icon: '📘' },
  { name: 'React / Next.js', icon: '⚛️' },
  { name: 'AWS Cloud', icon: '☁️' },
  { name: 'Python', icon: '🐍' },
  { name: 'AI / ML', icon: '🤖' },
  { name: 'Docker', icon: '🐳' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'Git', icon: '🔀' },
];

const TIMELINE = [
  {
    year: '2026',
    title: 'Building in Public',
    desc: 'Launched this blog to share knowledge and document the journey to senior developer.',
  },
  {
    year: 'Now',
    title: 'Learning & Growing',
    desc: 'Deep-diving into AI Agents, System Design, and Cloud Architecture.',
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>B</div>
          </div>
          <h1 className={styles.name}>Hey, I&apos;m Bravee 👋</h1>
          <p className={styles.bio}>
            I&apos;m a full-stack developer passionate about building products and sharing knowledge.
            This blog is my space to document everything I learn — from <strong>AI and cloud computing</strong> 
            to <strong>system design and engineering practices</strong>.
          </p>
          <p className={styles.bio}>
            I believe that the best way to truly understand something is to teach it. 
            That&apos;s why I write: to solidify my own understanding and help others 
            on the same journey.
          </p>
        </section>

        {/* What I Write About */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What I Write About</h2>
          <div className={styles.topicGrid}>
            <div className={styles.topicCard}>
              <span className={styles.topicIcon}>🤖</span>
              <h3>AI & Machine Learning</h3>
              <p>LLMs, AI Agents, RAG systems, and practical AI applications.</p>
            </div>
            <div className={styles.topicCard}>
              <span className={styles.topicIcon}>☁️</span>
              <h3>Cloud & DevOps</h3>
              <p>AWS services, cloud architecture, CI/CD, and infrastructure.</p>
            </div>
            <div className={styles.topicCard}>
              <span className={styles.topicIcon}>💻</span>
              <h3>Software Engineering</h3>
              <p>Java, Angular, React, system design, and clean code practices.</p>
            </div>
            <div className={styles.topicCard}>
              <span className={styles.topicIcon}>🚀</span>
              <h3>Career Growth</h3>
              <p>The journey from junior to senior developer — lessons and insights.</p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tech Stack</h2>
          <div className={styles.techGrid}>
            {TECH_STACK.map(tech => (
              <div key={tech.name} className={styles.techItem}>
                <span className={styles.techIcon}>{tech.icon}</span>
                <span className={styles.techName}>{tech.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Timeline</h2>
          <div className={styles.timeline}>
            {TIMELINE.map((item, i) => (
              <div key={i} className={styles.timelineItem}>
                <span className={styles.timelineYear}>{item.year}</span>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Connect */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Let&apos;s Connect</h2>
          <p className={styles.connectText}>
            I&apos;m always happy to chat about tech, collaborate on projects, or just say hi.
          </p>
          <div className={styles.connectLinks}>
            <a href="https://github.com/bravee06" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              GitHub
            </a>
            <a href="https://linkedin.com/in/bravee06" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              LinkedIn
            </a>
            <a href="https://x.com/bravee06" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              X / Twitter
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
