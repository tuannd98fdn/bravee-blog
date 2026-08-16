import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface PostMeta {
  title: string;
  date: string;
  description: string;
  tags: string[];
  lang: 'en' | 'vi';
  slug: string;
  readingTime: string;
  category: 'blog' | 'tutorial' | 'til' | 'project';
  image?: string;
  featured?: boolean;
}

export interface Post {
  meta: PostMeta;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function getFilesRecursively(dir: string): Promise<string[]> {
  if (!fs.existsSync(dir)) return [];
  
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFilesRecursively(fullPath)));
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function getAllPosts(category?: string, lang?: string): Promise<PostMeta[]> {
  const searchDir = category 
    ? path.join(CONTENT_DIR, category) 
    : CONTENT_DIR;
  
  const files = await getFilesRecursively(searchDir);
  
  const postsPromises = files.map(async (filePath) => {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    // Determine category from path
    const relativePath = path.relative(CONTENT_DIR, filePath);
    const pathParts = relativePath.split(path.sep);
    const fileCategory = pathParts[0] as PostMeta['category'];
    
    // Determine language from path
    const fileLang = pathParts.includes('vi') ? 'vi' : 'en';
    
    // Generate slug from filename (strip YYYY-MM-DD- prefix if present)
    const rawSlug = path.basename(filePath, path.extname(filePath));
    const slug = rawSlug.replace(/^\d{4}-\d{2}-\d{2}-/, '');

    const stats = readingTime(content);

    return {
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      description: data.description || '',
      tags: data.tags || [],
      lang: (data.lang || fileLang) as 'en' | 'vi',
      slug,
      readingTime: stats.text,
      category: (data.category || fileCategory) as PostMeta['category'],
      image: data.image || null,
      featured: data.featured || false,
    } as PostMeta;
  });

  const posts = await Promise.all(postsPromises);

  // Filter by language if specified
  const filtered = lang ? posts.filter(p => p.lang === lang) : posts;

  // Sort by date (newest first)
  return filtered.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const files = await getFilesRecursively(CONTENT_DIR);
  
  const filePath = files.find((f) => {
    const rawSlug = path.basename(f, path.extname(f));
    const fileSlug = rawSlug.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    return fileSlug === slug;
  });

  if (!filePath) return null;

  const fileContent = await fs.promises.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  const relativePath = path.relative(CONTENT_DIR, filePath);
  const pathParts = relativePath.split(path.sep);
  const fileCategory = pathParts[0] as PostMeta['category'];
  const fileLang = pathParts.includes('vi') ? 'vi' : 'en';
  
  const stats = readingTime(content);

  return {
    meta: {
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      description: data.description || '',
      tags: data.tags || [],
      lang: (data.lang || fileLang) as 'en' | 'vi',
      slug,
      readingTime: stats.text,
      category: (data.category || fileCategory) as PostMeta['category'],
      image: data.image || null,
      featured: data.featured || false,
    } as PostMeta,
    content,
  };
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter(post => 
    post.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export async function getAdjacentPosts(slug: string): Promise<{ prev: PostMeta | null; next: PostMeta | null }> {
  const posts = await getAllPosts();
  const index = posts.findIndex(p => p.slug === slug);
  
  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}
