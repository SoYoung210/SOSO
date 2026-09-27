import { getRelativeLocaleUrl } from 'astro:i18n'
import { getCollection, type CollectionEntry } from 'astro:content'
import { LANGS, type Alternates, type Lang } from '../i18n/ui'

export type Post = CollectionEntry<'blog'>

export const postLang = (post: Post) => post.id.slice(0, post.id.indexOf('/')) as Lang

/** Path shared by both languages, e.g. `react/scoped-context`. */
export const postSlug = (post: Post) => post.id.slice(post.id.indexOf('/') + 1)

export const postUrl = (post: Post) => getRelativeLocaleUrl(postLang(post), postSlug(post))

export const homeUrl = (lang: Lang) => getRelativeLocaleUrl(lang)

/** Posts without a `category` are not published (same rule as the old gatsby-node). */
export async function getPublishedPosts(lang: Lang): Promise<Post[]> {
  const posts = await getCollection('blog', (post) => !!post.data.category && postLang(post) === lang)
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

/** Posts visible in lists and feeds: scheduled (future-dated) posts stay hidden until their date. */
export async function getListedPosts(lang: Lang): Promise<Post[]> {
  const now = Date.now()
  return (await getPublishedPosts(lang)).filter((post) => post.data.date.valueOf() <= now)
}

export async function getTranslation(post: Post, lang: Lang): Promise<Post | undefined> {
  const id = `${lang}/${postSlug(post)}`
  // `getEntry` would log a warning for every post that has no translation yet.
  const [entry] = await getCollection('blog', (candidate) => candidate.id === id && !!candidate.data.category)
  return entry
}

/** URLs of every existing language version of a post. */
export async function postAlternates(post: Post): Promise<Alternates> {
  const alternates: Alternates = {}
  for (const lang of LANGS) {
    const version = lang === postLang(post) ? post : await getTranslation(post, lang)
    if (version) alternates[lang] = postUrl(version)
  }
  return alternates
}

export async function postPaths(lang: Lang) {
  const posts = await getPublishedPosts(lang)
  return posts.map((post, index) => ({
    params: { slug: postSlug(post) },
    props: { post, previous: posts[index + 1] ?? null, next: posts[index - 1] ?? null },
  }))
}

/**
 * Posts that exist in another language but not in `lang`. Their `lang` URLs redirect to the version that
 * exists, so old links (e.g. to Korean-only posts, which used to live at the root) keep working.
 */
export async function missingTranslationRedirects(lang: Lang) {
  const redirects = []
  for (const other of LANGS.filter((code) => code !== lang)) {
    for (const post of await getPublishedPosts(other)) {
      if (!(await getTranslation(post, lang))) {
        redirects.push({ params: { slug: postSlug(post) }, props: { redirectTo: postUrl(post) } })
      }
    }
  }
  return redirects
}

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
