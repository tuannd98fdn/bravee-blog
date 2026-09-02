'use client';

import { useEffect, useState } from 'react';
import styles from './TableOfContents.module.css';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  variant?: 'sidebar' | 'inline';
}

export default function TableOfContents({ variant = 'sidebar' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.prose h2, .prose h3'))
      .filter((element) => element.id)
      .map((element) => ({
        id: element.id,
        text: element.textContent || '',
        level: Number(element.tagName.substring(1)),
      }));
    setHeadings(elements);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    elements.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (variant === 'inline') {
    return (
      <details className={styles.inlineToc}>
        <summary className={styles.inlineSummary}>
          <span className={styles.inlineTitle}>📑 Mục lục bài viết</span>
          <span className={styles.inlineCount}>{headings.length} mục</span>
        </summary>
        <ul className={styles.inlineList}>
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`${styles.inlineItem} ${heading.level === 3 ? styles.indent : ''}`}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(heading.id);
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </details>
    );
  }

  return (
    <nav className={styles.toc}>
      <h3 className={styles.title}>On this page</h3>
      <ul className={styles.list}>
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`${styles.item} ${heading.level === 3 ? styles.indent : ''} ${
              activeId === heading.id ? styles.active : ''
            }`}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToHeading(heading.id);
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
