import { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags, getPostsByTag } from '@/lib/mdx';
import styles from './tags.module.css';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse all blog posts by topic.',
};

export default function TagsPage() {
  const tags = getAllTags();
  
  // Count posts per tag to display
  const tagsWithCounts = tags.map(tag => ({
    name: tag,
    count: getPostsByTag(tag).length
  })).sort((a, b) => b.count - a.count); // Sort by most used

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tags</h1>
        <p className={styles.description}>
          Browse all {tags.length} topics covered in the blog.
        </p>
      </header>

      <div className={styles.grid}>
        {tagsWithCounts.map(({ name, count }) => (
          <Link href={`/tags/${encodeURIComponent(name.toLowerCase())}`} key={name} className={styles.card}>
            <h2 className={styles.tagName}>#{name}</h2>
            <span className={styles.count}>
              {count} {count === 1 ? 'post' : 'posts'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
