import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// Keep the raw path (no slugify) so ids match the old Gatsby slugs exactly,
// e.g. `essay/2019의-발표들-회고` and `react/ssr-2-ssr---basic`.
const rawPathId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '')

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/blog', generateId: rawPathId }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.string().optional(),
      thumbnail: image().optional(),
    }),
})

const about = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/__about', generateId: rawPathId }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['ko', 'en']),
  }),
})

export const collections = { blog, about }
