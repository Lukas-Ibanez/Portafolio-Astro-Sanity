import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Projects are defined fully in code (no Sanity). Each `.md` file in
// src/content/projects/ is one case study. The markdown body is optional
// extra detail; the structured fields below drive the listing + detail pages.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    year: z.union([z.string(), z.number()]),
    role: z.string(),
    // Short text for the card.
    summary: z.string(),
    // Case-study body (plain strings; rendered as paragraphs).
    problem: z.string(),
    solution: z.string(),
    // Measurable result — owner-only data. Leave empty until it exists; an
    // empty value is simply not rendered (no visible placeholder).
    result: z.string().default(''),
    stack: z.array(z.string()),
    // Optional cover image as a path under /public, e.g. '/projects/foo.avif'.
    coverImage: z.string().optional(),
    coverAlt: z.string().optional(),
    gallery: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]),
    // Either link to an internal case study (default) or straight to a live
    // external site / subdomain.
    externalUrl: z.url().optional(),
    repoUrl: z.url().optional(),
    featured: z.boolean().default(false),
    // If true, hide all imagery and show an NDA notice instead.
    confidential: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = {
  projects,
};
