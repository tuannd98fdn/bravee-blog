'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PostMeta } from '@/lib/mdx';
import { searchPosts } from '@/lib/search';
import BlogCard from '@/components/ui/BlogCard';
import styles from './blog.module.css';

interface BlogListProps {
  posts: PostMeta[];
  tags: string[];
}

export default function BlogList({ posts, tags }: BlogListProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<'all' | 'en' | 'vi'>('all');

  const filtered = useMemo(() => {
    let result = posts;
    
    if (selectedTag) {
      result = result.filter(p => 
        p.tags.map(t => t.toLowerCase()).includes(selectedTag.toLowerCase())
      );
    }
    
    if (selectedLang !== 'all') {
      result = result.filter(p => p.lang === selectedLang);
    }
    
    if (query.trim()) {
      result = searchPosts(result, query);
    }
    
    return result;
  }, [posts, query, selectedTag, selectedLang]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>
          Thoughts on AI, cloud architecture, programming, and the journey to becoming a senior developer.
        </p>
      </div>

      {/* Search & Filters */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          {query && (
            <button 
              className={styles.searchClear} 
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className={styles.langFilter}>
          <select 
            value={selectedLang} 
            onChange={(e) => setSelectedLang(e.target.value as any)}
            className={styles.langSelect}
          >
            <option value="all">All Languages</option>
            <option value="en">🇺🇸 English</option>
            <option value="vi">🇻🇳 Tiếng Việt</option>
          </select>
        </div>
        <div className={styles.tags}>
          <button
            className={`${styles.tagBtn} ${!selectedTag ? styles.tagBtnActive : ''}`}
            onClick={() => setSelectedTag(null)}
          >
            All
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              className={`${styles.tagBtn} ${selectedTag === tag ? styles.tagBtnActive : ''}`}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className={styles.resultCount}>
        {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
        {selectedLang !== 'all' && <> in <strong>{selectedLang === 'en' ? 'English' : 'Tiếng Việt'}</strong></>}
        {selectedTag && <> tagged <strong>{selectedTag}</strong></>}
        {query && <> matching <strong>&ldquo;{query}&rdquo;</strong></>}
      </p>

      {/* Post List */}
      {filtered.length > 0 ? (
        <div className={styles.postList}>
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No posts found. Try a different search or filter.</p>
        </div>
      )}
    </div>
  );
}
