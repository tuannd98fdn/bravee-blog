import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug, getAdjacentPosts } from '@/lib/mdx';
import { mdxComponents } from '@/components/mdx/MDXComponents';
import BlogPostContent from './BlogPostContent';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts('blog');
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.description,
    keywords: post.meta.tags,
    openGraph: {
      type: 'article',
      title: post.meta.title,
      description: post.meta.description,
      publishedTime: post.meta.date,
      tags: post.meta.tags,
      images: [{ url: `/og?title=${encodeURIComponent(post.meta.title)}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.description,
      images: [`/og?title=${encodeURIComponent(post.meta.title)}`],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = await getAdjacentPosts(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta.title,
    datePublished: post.meta.date,
    dateModified: post.meta.date,
    description: post.meta.description,
    author: {
      '@type': 'Person',
      name: 'Bravee',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostContent
        post={post}
        prevPost={prev}
        nextPost={next}
      >
        <MDXRemote source={post.content} components={mdxComponents} />
      </BlogPostContent>
    </>
  );
}
