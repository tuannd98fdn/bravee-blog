'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Search } from 'lucide-react';
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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    } else {
      setQuery('');
    }
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
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className={styles.triggerBtn} aria-label="Search">
          <Search size={18} />
          <span className={styles.shortcut}>⌘K</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.dialog}>
          <div className={styles.searchHeader}>
            <Search size={20} className={styles.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder="Search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Dialog.Close asChild>
              <button className={styles.escBtn}>ESC</button>
            </Dialog.Close>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
