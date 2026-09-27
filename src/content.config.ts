import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// `react/scoped-context.md` is the Korean original and `react/scoped-context.en.md` its English
// translation. Ids are `<lang>/<raw path>` without slugifying, so the path part matches the old Gatsby
// slugs exactly (e.g. `ko/essay/2019의-발표들-회고`, `en/react/ssr-2-ssr---basic`).
const localizedId = ({ entry }: { entry: string }) =>
  entry.endsWith('.en.md') ? `en/${entry.slice(0, -'.en.md'.length)}` : `ko/${entry.slice(0, -'.md'.length)}`

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/blog', generateId: localizedId }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.string().optional(),
      thumbnail: image().optional(),
      // `false` on a Korean post that should stay Korean-only (e.g. it is itself a translation).
      translate: z.boolean().default(true),
    }),
})

const about = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/__about', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['ko', 'en']),
  }),
})

export const collections = { blog, about }
