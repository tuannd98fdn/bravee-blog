import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllTags, getPostsByTag } from '@/lib/mdx';
import BlogCard from '@/components/ui/BlogCard';
import styles from './tag.module.css';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag: tag.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  return {
    title: `Posts tagged "${decodedTag}"`,
    description: `All blog posts related to ${decodedTag}.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  // Find original tag casing
  const allTags = getAllTags();
  const originalTag = allTags.find(t => t.toLowerCase() === decodedTag.toLowerCase());

  if (!originalTag) {
    notFound();
  }

  const posts = getPostsByTag(originalTag);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/tags" className={styles.backLink}>
          ← All tags
        </Link>
        <h1 className={styles.title}>
          <span className={styles.hash}>#</span>
          {originalTag}
        </h1>
        <p className={styles.description}>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </header>

      <div className={styles.grid}>
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
