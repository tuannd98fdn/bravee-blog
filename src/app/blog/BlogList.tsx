'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PostMeta } from '@/lib/mdx';
import { searchPosts } from '@/lib/search';
import styles from './blog.module.css';

interface BlogListProps {
  posts: PostMeta[];
  tags: string[];
}

export default function BlogList({ posts, tags }: BlogListProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = posts;
    
    if (selectedTag) {
      result = result.filter(p => 
        p.tags.map(t => t.toLowerCase()).includes(selectedTag.toLowerCase())
      );
    }
    
    if (query.trim()) {
      result = searchPosts(result, query);
    }
    
    return result;
  }, [posts, query, selectedTag]);

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
        {selectedTag && <> tagged <strong>{selectedTag}</strong></>}
        {query && <> matching <strong>&ldquo;{query}&rdquo;</strong></>}
      </p>

      {/* Post List */}
      {filtered.length > 0 ? (
        <div className={styles.postList}>
          {filtered.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.slug}
              className={styles.postCard}
            >
              <div className={styles.postLeft}>
                <time className={styles.postDate}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <div className={styles.postRight}>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.postDesc}>{post.description}</p>
                <div className={styles.postFooter}>
                  <div className={styles.postTags}>
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <span className={styles.postReadTime}>{post.readingTime}</span>
                </div>
              </div>
            </Link>
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
