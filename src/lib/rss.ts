import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { t, LANG_META, type Lang } from '../i18n/ui'
import { excerpt, getListedPosts, postUrl } from './posts'
import { SITE } from '../site.config'

export async function feed(context: APIContext, lang: Lang) {
  const posts = await getListedPosts(lang)
  return rss({
    title: SITE.title,
    description: t(lang, 'description'),
    site: context.site!,
    trailingSlash: true,
    customData: `<language>${LANG_META[lang].htmlLang}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: postUrl(post),
      description: excerpt(post.body, 200),
      categories: post.data.category ? [post.data.category] : [],
    })),
  })
}
