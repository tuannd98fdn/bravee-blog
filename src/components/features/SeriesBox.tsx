import Link from 'next/link';
import { PostMeta } from '@/lib/mdx';
import styles from './SeriesBox.module.css';

interface SeriesBoxProps {
  seriesName: string;
  currentSlug: string;
  posts: PostMeta[];
}

export default function SeriesBox({ seriesName, currentSlug, posts }: SeriesBoxProps) {
  if (!posts || posts.length <= 1) return null;

  const sortedPosts = [...posts].sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
  const currentIndex = sortedPosts.findIndex(p => p.slug === currentSlug);

  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>Series</span>
          <h4 className={styles.title}>{seriesName}</h4>
        </div>
        <span className={styles.progress}>
          {currentIndex >= 0 ? `Phần ${currentIndex + 1} / ${sortedPosts.length}` : `${sortedPosts.length} phần`}
        </span>
      </div>

      <ol className={styles.list}>
        {sortedPosts.map((post, idx) => {
          const isCurrent = post.slug === currentSlug;
          const order = post.seriesOrder || idx + 1;

          return (
            <li key={post.slug} className={styles.item}>
              {isCurrent ? (
                <div className={`${styles.link} ${styles.activeLink}`}>
                  <div className={styles.itemLeft}>
                    <span className={styles.partNumber}>Phần {order}:</span>
                    <span className={styles.postTitle}>{post.title.replace(/^\[.*?\]\s*/, '')}</span>
                  </div>
                  <span className={styles.activeBadge}>Đang đọc</span>
                </div>
              ) : (
                <Link href={`/blog/${post.slug}`} className={styles.link}>
                  <div className={styles.itemLeft}>
                    <span className={styles.partNumber}>Phần {order}:</span>
                    <span className={styles.postTitle}>{post.title.replace(/^\[.*?\]\s*/, '')}</span>
                  </div>
                  <span className={styles.progress}>{post.readingTime}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
