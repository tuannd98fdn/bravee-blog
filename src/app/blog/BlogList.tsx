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

const CATEGORIES = [
  { id: 'all', label: 'All Topics', emoji: '✨' },
  { id: 'ai', label: 'AI & Agents', emoji: '🤖', matchTags: ['ai', 'llm', 'agent', 'rag', 'mcp', 'prompt engineering', 'langchain', 'langgraph', 'deepseek', 'glimmer', 'genai', 'vector database', 'function calling', 'loop engineering', 'memory', 'llmops', 'evals'] },
  { id: 'cloud', label: 'Cloud & AWS', emoji: '☁️', matchTags: ['aws', 'sap-c02', 'iam', 'security', 'cloud'] },
  { id: 'engineering', label: 'System & Architecture', emoji: '🏗️', matchTags: ['architecture', 'system design', 'java', 'angular', 'nextjs', 'typescript'] },
  { id: 'career', label: 'Career & General', emoji: '🚀', matchTags: ['career', 'blogging', 'intro', 'general', 'learning'] },
];

export default function BlogList({ posts, tags, seriesList }: BlogListProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<'all' | 'vi' | 'en'>('all');
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  // Available tags in currently selected category
  const availableTags = useMemo(() => {
    if (selectedCategory === 'all') return tags;
    const cat = CATEGORIES.find(c => c.id === selectedCategory);
    if (!cat || !cat.matchTags) return tags;
    return tags.filter(t => cat.matchTags?.some(mt => t.toLowerCase().includes(mt) || mt.includes(t.toLowerCase())));
  }, [tags, selectedCategory]);

  const filtered = useMemo(() => {
    let result = posts;

    // Filter by Language
    if (selectedLang !== 'all') {
      result = result.filter(p => p.lang === selectedLang);
    }

    // Filter by Series
    if (selectedSeries) {
      result = result.filter(p => p.series === selectedSeries);
    }

    // Filter by Category
    if (selectedCategory !== 'all') {
      const cat = CATEGORIES.find(c => c.id === selectedCategory);
      if (cat && cat.matchTags) {
        result = result.filter(p => 
          p.tags.some(t => cat.matchTags?.some(mt => t.toLowerCase().includes(mt) || mt.includes(t.toLowerCase())))
        );
      }
    }

    // Filter by Specific Tag
    if (selectedTag) {
      result = result.filter(p => 
        p.tags.map(t => t.toLowerCase()).includes(selectedTag.toLowerCase())
      );
    }

    // Filter by Search Query
    if (query.trim()) {
      result = searchPosts(result, query);
    }

    return result;
  }, [posts, selectedLang, selectedSeries, selectedCategory, selectedTag, query]);

  // Featured Posts (top 3 featured posts, fallback to most recent)
  const featuredPosts = useMemo(() => {
    const featured = posts.filter(p => p.featured);
    if (featured.length >= 3) return featured.slice(0, 3);
    return [...featured, ...posts.filter(p => !p.featured)].slice(0, 3);
  }, [posts]);

  const isFilteringActive = Boolean(
    selectedCategory !== 'all' || selectedTag || selectedLang !== 'all' || selectedSeries || query.trim()
  );

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedTag(null);
    setSelectedLang('all');
    setSelectedSeries(null);
    setQuery('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>
          Thoughts on AI, cloud architecture, programming, and the journey to becoming a senior developer.
        </p>
      </div>

      {/* Khu 1: FeaturedBentoGrid */}
      {!isFilteringActive && featuredPosts.length >= 3 && (
        <section className={styles.featuredSection}>
          <div className={styles.sectionHeaderRow}>
            <h2 className={styles.sectionTitle}>Featured Posts</h2>
            <span className={styles.sectionSubtitle}>Editor&apos;s pick</span>
          </div>
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
      {!isFilteringActive && seriesList.length > 0 && (
        <section className={styles.seriesSection}>
          <div className={styles.sectionHeaderRow}>
            <h2 className={styles.sectionTitle}>Featured Series</h2>
            <span className={styles.sectionSubtitle}>Curated learning tracks</span>
          </div>
          <div className={styles.seriesCarousel}>
            {seriesList.map(series => {
              const count = posts.filter(p => p.series === series).length;
              return (
                <button
                  key={series}
                  className={`${styles.seriesCard} ${selectedSeries === series ? styles.seriesCardActive : ''}`}
                  onClick={() => setSelectedSeries(series)}
                >
                  <span className={styles.seriesBadge}>Series</span>
                  <h3 className={styles.seriesCardTitle}>{series}</h3>
                  <p className={styles.seriesCardDesc}>
                    {count} {count === 1 ? 'part' : 'parts'} · Explore series →
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Khu 3: Controls, Category Tabs, Language & Search */}
      <section className={styles.controls}>
        <div className={styles.controlsTop}>
          <h2 className={styles.sectionTitle}>All Posts</h2>
          
          {/* Language Switcher */}
          <div className={styles.langSwitch}>
            <button
              className={`${styles.langBtn} ${selectedLang === 'all' ? styles.langBtnActive : ''}`}
              onClick={() => setSelectedLang('all')}
            >
              All
            </button>
            <button
              className={`${styles.langBtn} ${selectedLang === 'vi' ? styles.langBtnActive : ''}`}
              onClick={() => setSelectedLang('vi')}
              title="Tiếng Việt"
            >
              🇻🇳 VI
            </button>
            <button
              className={`${styles.langBtn} ${selectedLang === 'en' ? styles.langBtnActive : ''}`}
              onClick={() => setSelectedLang('en')}
              title="English"
            >
              🇺🇸 EN
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className={styles.categoryTabs}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`${styles.categoryTab} ${selectedCategory === cat.id ? styles.categoryTabActive : ''}`}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedTag(null);
              }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Tag Sub-filter (when relevant) */}
        {availableTags.length > 0 && selectedCategory !== 'all' && (
          <div className={styles.tagSubFilter}>
            <span className={styles.subFilterLabel}>Filter by tag:</span>
            <button
              className={`${styles.subTagPill} ${!selectedTag ? styles.subTagPillActive : ''}`}
              onClick={() => setSelectedTag(null)}
            >
              All {selectedCategory}
            </button>
            {availableTags.slice(0, 10).map(tag => (
              <button
                key={tag}
                className={`${styles.subTagPill} ${selectedTag === tag ? styles.subTagPillActive : ''}`}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar */}
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search posts by title, tag, or content..."
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

      {/* Results header & Active filters */}
      <div className={styles.filterMetaRow}>
        <p className={styles.resultCount}>
          Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'post' : 'posts'}
          {selectedSeries && <> in series <strong>&ldquo;{selectedSeries}&rdquo;</strong></>}
          {selectedTag && <> tagged <strong>#{selectedTag}</strong></>}
          {selectedLang !== 'all' && <> in <strong>{selectedLang === 'vi' ? 'Tiếng Việt' : 'English'}</strong></>}
          {query && <> matching <strong>&ldquo;{query}&rdquo;</strong></>}
        </p>
        
        {isFilteringActive && (
          <button onClick={resetFilters} className={styles.resetBtn}>
            Reset filters ✕
          </button>
        )}
      </div>

      {/* Khu 4: Grid 3 cột */}
      {filtered.length > 0 ? (
        <div className={styles.postGrid}>
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyEmoji}>🔍</p>
          <p className={styles.emptyTitle}>No matching posts found</p>
          <p className={styles.emptyText}>Try changing your search terms or resetting filters.</p>
          <button onClick={resetFilters} className="btn btn-ghost" style={{ marginTop: 'var(--space-4)' }}>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
