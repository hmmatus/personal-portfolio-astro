import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bilingualText = z.object({
  en: z.string(),
  es: z.string(),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    banner: z.string(),
    description: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: z.object({
    slug: z.string(),
    image: z.string(),
    tags: z.array(z.string()),
    links: z
      .array(
        z.object({
          type: z.enum(['live-demo', 'github']),
          url: z.string().url(),
        })
      )
      .optional(),
    year: z.string(),
    role: bilingualText.optional(),
    title: bilingualText,
    description: bilingualText,
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/experience' }),
  schema: z
    .object({
      slug: z.string(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      isCurrent: z.boolean().default(false),
      title: bilingualText,
      company: bilingualText,
      description: bilingualText,
    })
    .refine((data) => data.isCurrent || !data.endDate || data.endDate >= data.startDate, {
      message: 'endDate must not be earlier than startDate',
      path: ['endDate'],
    }),
});

export const collections = { blog, projects, experience };
