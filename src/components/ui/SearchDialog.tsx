'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PostMeta } from '@/lib/mdx';
import { searchPosts } from '@/lib/search';
import styles from './SearchDialog.module.css';

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [results, setResults] = useState<PostMeta[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Fetch posts on first open
  useEffect(() => {
    if (isOpen && posts.length === 0) {
      setIsLoading(true);
      fetch('/api/search')
        .then((res) => res.json())
        .then((data) => {
          setPosts(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [isOpen, posts.length]);

  // Handle search
  useEffect(() => {
    if (query.trim()) {
      setResults(searchPosts(posts, query).slice(0, 5));
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query, posts]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        router.push(`/blog/${selected.slug}`);
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      <button 
        className={styles.triggerBtn} 
        onClick={() => setIsOpen(true)}
        aria-label="Search"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className={styles.shortcut}>⌘K</span>
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.searchHeader}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder="Search posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className={styles.escBtn} onClick={() => setIsOpen(false)}>ESC</button>
            </div>

            <div className={styles.results}>
              {isLoading && <div className={styles.stateMessage}>Loading...</div>}
              
              {!isLoading && query && results.length === 0 && (
                <div className={styles.stateMessage}>No results found for &ldquo;{query}&rdquo;</div>
              )}

              {!isLoading && !query && (
                <div className={styles.stateMessage}>Type to search across all posts</div>
              )}

              {results.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`${styles.resultItem} ${i === selectedIndex ? styles.selected : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <h4 className={styles.resultTitle}>{post.title}</h4>
                  <div className={styles.resultMeta}>
                    <span className={styles.resultDate}>
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className={styles.resultTags}>
                      {post.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className={styles.footer}>
              <div className={styles.instruction}>
                <span className={styles.key}>↑</span>
                <span className={styles.key}>↓</span>
                to navigate
              </div>
              <div className={styles.instruction}>
                <span className={styles.key}>↵</span>
                to select
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
