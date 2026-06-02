import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    problem: z.string(),
    solution: z.string(),
    stack: z.array(z.string()),
    role: z.string(),
    featured: z.boolean().default(false),
    repoUrl: z.url().optional(),
    liveUrl: z.url().optional(),
    image: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = {
  projects,
};
