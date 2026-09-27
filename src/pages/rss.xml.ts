import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { excerpt, getPublishedPosts, postUrl } from '../lib/posts'
import { SITE } from '../site.config'

export async function GET(context: APIContext) {
  const now = Date.now()
  const posts = (await getPublishedPosts()).filter((post) => post.data.date.valueOf() <= now)

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: postUrl(post),
      description: excerpt(post.body, 200),
      categories: post.data.category ? [post.data.category] : [],
    })),
  })
}
