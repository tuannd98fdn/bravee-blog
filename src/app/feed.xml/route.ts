import RSS from 'rss';
import { getAllPosts } from '@/lib/mdx';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const feed = new RSS({
    title: 'Bravee Blog',
    description: 'Personal tech blog sharing knowledge on AI, Cloud, Java, Angular, and the journey from junior to senior developer.',
    site_url: siteUrl,
    feed_url: `${siteUrl}/feed.xml`,
    language: 'en',
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, Bravee`,
  });

  const posts = await getAllPosts('blog');

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      date: post.date,
      categories: post.tags,
      author: 'Bravee',
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
