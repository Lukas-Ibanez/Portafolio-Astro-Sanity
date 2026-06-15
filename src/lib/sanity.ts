import { createClient } from '@sanity/client';
import { escapeHTML, toHTML, uriLooksSafe } from '@portabletext/to-html';

export type SanityPost = {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  category?: string;
  publishedAt: string;
  bodyHtml: string;
  readingTime: number;
  readingTimeLabel: string;
  sources: Array<{
    title: string;
    url: string;
  }>;
  coverImage?: {
    ref: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
};

const projectId = import.meta.env.SANITY_PROJECT_ID || '9286uqeo';
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
  category,
  tags,
  publishedAt,
  readTime,
  body,
  content,
  sources,
  "coverImage": coverImage.asset->_ref,
  seo
}`;

function renderCodeBlock(value: any) {
  const language = value.language ? ` data-language="${escapeHTML(value.language)}"` : '';
  const code = escapeHTML(value.code || '');
  return `<figure class="code-block"${language}><pre><code>${code}</code></pre></figure>`;
}

function renderPortableImage(value: any) {
  const ref = value?.asset?._ref;
  if (!ref) return '';

  return `<figure class="portable-image"><p class="portable-image-placeholder">Imagen del artículo disponible en Sanity.</p></figure>`;
}

const portableTextComponents = {
  types: {
    code: ({ value }: any) => renderCodeBlock(value),
    image: ({ value }: any) => renderPortableImage(value),
  },
  marks: {
    link: ({ children, value }: any) => {
      const href = value?.href || '';
      if (!uriLooksSafe(href)) return children;

      const rel = href.startsWith('/') ? '' : ' rel="noreferrer noopener" target="_blank"';
      return `<a href="${escapeHTML(href)}"${rel}>${children}</a>`;
    },
  },
};

function estimateReadingTime(html: string) {
  const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function plainBlockText(block: any): string {
  if (!block || block._type !== 'block' || !Array.isArray(block.children)) return '';
  return block.children.map((child: any) => child?.text || '').join('');
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[…\.\s]+$/u, '')
    .trim();
}

// The excerpt is rendered as a styled lead on the post page. Some posts repeat
// that same text as the first body paragraph, which looks duplicated. If the
// first block matches the excerpt, drop it so the article doesn't start by
// repeating the lead.
function stripDuplicateLead(content: any[], excerpt: string): any[] {
  if (!Array.isArray(content) || content.length === 0 || !excerpt) return content;

  const first = content[0];
  const firstText = normalizeText(plainBlockText(first));
  if (!firstText) return content;

  const lead = normalizeText(excerpt);
  const isDuplicate =
    firstText === lead ||
    (lead.length > 40 && firstText.startsWith(lead)) ||
    (firstText.length > 40 && lead.startsWith(firstText));

  return isDuplicate ? content.slice(1) : content;
}

function normalizePost(post: any): SanityPost {
  const rawContent = post.content || post.body || [];
  const portableContent = stripDuplicateLead(rawContent, post.excerpt || '');
  const bodyHtml = toHTML(portableContent, { components: portableTextComponents });
  const readingTime = estimateReadingTime(bodyHtml);
  const coverImageRef = typeof post.coverImage === 'string' ? post.coverImage : undefined;

  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    category: post.category,
    tags: post.tags || [],
    publishedAt: post.publishedAt,
    bodyHtml,
    readingTime,
    readingTimeLabel: post.readTime || `${readingTime} min`,
    sources: post.sources || [],
    coverImage: coverImageRef ? { ref: coverImageRef } : undefined,
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
