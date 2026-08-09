import Link from 'next/link';
import { PostMeta } from '@/lib/mdx';
import styles from './BlogCard.module.css';

interface BlogCardProps {
  post: PostMeta;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className={styles.postTitle}>{post.title}</h2>
          {post.lang && (
            <span style={{ fontSize: '14px' }}>
              {post.lang === 'vi' ? '🇻🇳' : '🇺🇸'}
            </span>
          )}
        </div>
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
  );
}
