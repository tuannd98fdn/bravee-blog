import Fuse from 'fuse.js';
import { PostMeta } from './mdx';

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
};

export function searchPosts(posts: PostMeta[], query: string): PostMeta[] {
  if (!query || query.trim().length < 2) return posts;
  
  const fuse = new Fuse(posts, fuseOptions);
  const results = fuse.search(query);
  
  return results.map(result => result.item);
}
