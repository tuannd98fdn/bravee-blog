import { getAllPosts, getAllTags, getAllSeries } from '@/lib/mdx';
import type { Metadata } from 'next';
import BlogList from './BlogList';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles about AI, Cloud, Java, Angular, and the journey from junior to senior developer.',
};

export default async function BlogPage() {
  const posts = await getAllPosts('blog');
  const tags = await getAllTags();
  const series = await getAllSeries();

  return <BlogList posts={posts} tags={tags} seriesList={series} />;
}
