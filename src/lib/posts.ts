import { getCollection, type CollectionEntry } from 'astro:content'

export type Post = CollectionEntry<'blog'>

/** Posts without a `category` are not published (same rule as the old gatsby-node). */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !!data.category)
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export const postUrl = (post: Post) => `/${post.id}/`

// Frontmatter dates have no timezone, so they are read (and shown) as UTC like before.
export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  })

/** Plain-text excerpt of a markdown body, like Gatsby's `excerpt(pruneLength, truncate)`. */
export function excerpt(markdown: string | undefined, length: number): string {
  const text = (markdown ?? '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > length ? `${text.slice(0, length)}…` : text
}
