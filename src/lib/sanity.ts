import { createClient } from '@sanity/client';
import { toHTML } from '@portabletext/to-html';

export type SanityPost = {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  bodyHtml: string;
  readingTime: number;
  seo?: {
    title?: string;
    description?: string;
  };
};

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET || 'production';
const apiVersion = import.meta.env.SANITY_API_VERSION || '2025-01-01';

const hasSanityConfig = Boolean(projectId && dataset);

const client = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null;

const postFields = `{
  title,
  "slug": slug.current,
  excerpt,
  tags,
  publishedAt,
  body,
  seo
}`;

function estimateReadingTime(html: string) {
  const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function normalizePost(post: any): SanityPost {
  const bodyHtml = toHTML(post.body || []);

  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    tags: post.tags || [],
    publishedAt: post.publishedAt,
    bodyHtml,
    readingTime: estimateReadingTime(bodyHtml),
    seo: post.seo,
  };
}

export async function getAllPosts(): Promise<SanityPost[]> {
  if (!client) return [];

  const posts = await client.fetch(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) ${postFields}`);
  return posts.map(normalizePost);
}

export async function getLatestPost(): Promise<SanityPost | null> {
  const posts = await getAllPosts();
  return posts[0] || null;
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  if (!client) return null;

  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0] ${postFields}`, { slug });
  return post ? normalizePost(post) : null;
}
