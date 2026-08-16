import Link from 'next/link';
import { PostMeta } from '@/lib/mdx';
import styles from './BlogCard.module.css';

interface BlogCardProps {
  post: PostMeta;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.postCard}>
      {post.coverImage && (
        <div className={styles.coverImageContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.title} className={styles.coverImage} />
        </div>
      )}
      <div className={styles.postContent}>
        {post.series && post.seriesOrder && (
          <div className={styles.seriesBadge}>
            Part {post.seriesOrder} of {post.series}
          </div>
        )}
        <div className={styles.postHeader}>
          <time className={styles.postDate}>
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
          {post.lang && (
            <span style={{ fontSize: '14px' }}>
              {post.lang === 'vi' ? '🇻🇳' : '🇺🇸'}
            </span>
          )}
        </div>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <p className={styles.postDesc}>{post.description}</p>
        <div className={styles.postFooter}>
          <div className={styles.postTags}>
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <span className={styles.postReadTime}>{post.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
