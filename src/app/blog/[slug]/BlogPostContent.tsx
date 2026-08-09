'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import ViewCounter from '@/components/features/ViewCounter';
import GiscusComments from '@/components/features/GiscusComments';
import { Post, PostMeta } from '@/lib/mdx';
import styles from './post.module.css';

interface Props {
  post: Post;
  prevPost: PostMeta | null;
  nextPost: PostMeta | null;
  children: React.ReactNode;
}

export default function BlogPostContent({ post, prevPost, nextPost, children }: Props) {
  const [progress, setProgress] = useState(0);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!articleRef.current) return;
      const el = articleRef.current;
      const rect = el.getBoundingClientRect();
      const totalHeight = el.scrollHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct = Math.min(100, (scrolled / totalHeight) * 100);
      setProgress(pct);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      <article ref={articleRef} className={styles.article}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.meta}>
            <Link href="/blog" className={styles.backLink}>
              ← Back to blog
            </Link>
            <div className={styles.metaRow}>
              <time dateTime={post.meta.date}>
                {new Date(post.meta.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
              <span>·</span>
              <span>{post.meta.readingTime}</span>
              {post.meta.lang && (
                <>
                  <span>·</span>
                  <span className={styles.lang}>
                    {post.meta.lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}
                  </span>
                </>
              )}
              <span>·</span>
              <ViewCounter slug={post.meta.slug} trackView={true} />
            </div>
          </div>
          <h1 className={styles.title}>{post.meta.title}</h1>
          <p className={styles.description}>{post.meta.description}</p>
          <div className={styles.tags}>
            {post.meta.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className={`${styles.content} prose`}>
          {children}
        </div>

        {/* Footer Navigation */}
        <footer className={styles.footer}>
          <div className={styles.navLinks}>
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`} className={styles.navLink}>
                <span className={styles.navLabel}>← Previous</span>
                <span className={styles.navTitle}>{prevPost.title}</span>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link href={`/blog/${nextPost.slug}`} className={`${styles.navLink} ${styles.navLinkNext}`}>
                <span className={styles.navLabel}>Next →</span>
                <span className={styles.navTitle}>{nextPost.title}</span>
              </Link>
            ) : <div />}
          </div>
        </footer>

        {/* Comments */}
        <GiscusComments />
      </article>
    </>
  );
}
