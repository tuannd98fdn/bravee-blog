'use client';

import { useState, useMemo } from 'react';
import { PostMeta } from '@/lib/mdx';
import { searchPosts } from '@/lib/search';
import BlogCard from '@/components/ui/BlogCard';
import styles from './blog.module.css';

interface BlogListProps {
  posts: PostMeta[];
  tags: string[];
  seriesList: string[];
}

export default function BlogList({ posts, tags, seriesList }: BlogListProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Group tags into general topics roughly based on typical tech blogs
  const topics = useMemo(() => {
    // If you want actual tags from tags[], you could just use them.
    // Or slice the top 10 tags. We'll show all tags as tabs for simplicity.
    return tags;
  }, [tags]);

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

  // Featured Posts (top 3 featured posts, fallback to most recent)
  const featuredPosts = useMemo(() => {
    const featured = posts.filter(p => p.featured);
    if (featured.length >= 3) return featured.slice(0, 3);
    return [...featured, ...posts.filter(p => !p.featured)].slice(0, 3);
  }, [posts]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>
          Thoughts on AI, cloud architecture, programming, and the journey to becoming a senior developer.
        </p>
      </div>

      {/* Khu 1: FeaturedBentoGrid */}
      {!query && !selectedTag && featuredPosts.length >= 3 && (
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Featured Posts</h2>
          <div className={styles.featuredGrid}>
            <div className={styles.featuredItemLarge}>
              <BlogCard post={featuredPosts[0]} />
            </div>
            <div className={styles.featuredItemSmall}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', height: '100%' }}>
                <div style={{ flex: 1 }}>
                  <BlogCard post={featuredPosts[1]} />
                </div>
                <div style={{ flex: 1 }}>
                  <BlogCard post={featuredPosts[2]} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Khu 2: SeriesCarousel */}
      {!query && !selectedTag && seriesList.length > 0 && (
        <section className={styles.seriesSection}>
          <h2 className={styles.sectionTitle}>Series</h2>
          <div className={styles.seriesCarousel}>
            {seriesList.map(series => {
              const count = posts.filter(p => p.series === series).length;
              return (
                <div key={series} className={styles.seriesCard}>
                  <h3 className={styles.seriesCardTitle}>{series}</h3>
                  <p className={styles.seriesCardDesc}>{count} {count === 1 ? 'post' : 'posts'}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Khu 3: TopicTabs & Search */}
      <section className={styles.controls}>
        <h2 className={styles.sectionTitle}>All Posts</h2>
        <div className={styles.topicTabs}>
          <button
            className={`${styles.topicTab} ${!selectedTag ? styles.topicTabActive : ''}`}
            onClick={() => setSelectedTag(null)}
          >
            All Topics
          </button>
          {topics.map(topic => (
            <button
              key={topic}
              className={`${styles.topicTab} ${selectedTag === topic ? styles.topicTabActive : ''}`}
              onClick={() => setSelectedTag(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

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
      </section>

      {/* Results count */}
      <p className={styles.resultCount}>
        {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
        {selectedTag && <> tagged <strong>{selectedTag}</strong></>}
        {query && <> matching <strong>&ldquo;{query}&rdquo;</strong></>}
      </p>

      {/* Khu 4: Grid 3 cột */}
      {filtered.length > 0 ? (
        <div className={styles.postGrid}>
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
