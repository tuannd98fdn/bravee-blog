import { getAllPosts, getAllTags } from '@/lib/mdx';
import type { Metadata } from 'next';
import BlogList from './BlogList';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles about AI, Cloud, Java, Angular, and the journey from junior to senior developer.',
};

export default function BlogPage() {
  const posts = getAllPosts('blog');
  const tags = getAllTags();

  return <BlogList posts={posts} tags={tags} />;
}
