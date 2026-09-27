import { useEffect, useRef, useState } from 'react'

export interface PostSummary {
  url: string
  title: string
  category: string
  date: string
  excerpt: string
}

interface Props {
  posts: PostSummary[]
  categories: string[]
  countOfInitialPost: number
}

const ALL = 'All'
// Same keys the Gatsby site used.
const COUNT_KEY = '__felog_session_storage_key__/count'
const CATEGORY_KEY = '__felog_session_storage_key__/category'
// Scroll position of the category bar after picking a category.
const DEST_POS = 316
// Load more posts when the page bottom is closer than this (px).
const BASE_LINE = 80

function readSession<T>(key: string): T | undefined {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : undefined
  } catch {
    return undefined
  }
}

function writeSession(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export default function PostList({ posts, categories, countOfInitialPost }: Props) {
  const [category, setCategory] = useState(ALL)
  const [count, setCount] = useState(1)
  const [restored, setRestored] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const now = Date.now()
  const filtered = posts.filter(
    (post) => (category === ALL || post.category === category) && new Date(post.date).valueOf() <= now,
  )
  const visible = filtered.slice(0, count * countOfInitialPost)
  const hasMore = filtered.length > visible.length

  useEffect(() => {
    const savedCategory = readSession<string>(CATEGORY_KEY)
    if (savedCategory && (savedCategory === ALL || categories.includes(savedCategory))) {
      setCategory(savedCategory)
    }
    setCount(readSession<number>(COUNT_KEY) ?? 1)
    setRestored(true)
  }, [categories])

  useEffect(() => {
    if (!restored) return
    writeSession(COUNT_KEY, count)
    writeSession(CATEGORY_KEY, category)
  }, [restored, count, category])

  useEffect(() => {
    if (!hasMore) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const distance = document.documentElement.offsetHeight - (window.scrollY + window.innerHeight)
        if (distance < BASE_LINE) setCount((prev) => prev + 1)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [hasMore, count])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(({ isIntersecting, target }) => {
          if (isIntersecting) target.classList.add('visible')
        }),
      { rootMargin: '20px', threshold: 0.8 },
    )
    listRef.current?.querySelectorAll('.thumbnail:not(.visible)').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  })

  const selectCategory = (next: string) => {
    setCategory(next)
    window.scrollTo({ top: DEST_POS, behavior: 'smooth' })
  }

  return (
    <>
      <ul className="category-container" role="tablist" id="category">
        {[ALL, ...categories].map((title) => (
          <li key={title} className="item" role="presentation" data-selected={category === title}>
            <button type="button" role="tab" aria-selected={category === title} onClick={() => selectCategory(title)}>
              {title}
            </button>
          </li>
        ))}
      </ul>
      <div className="thumbnail-container" ref={listRef}>
        {visible.map((post) => (
          <a className="thumbnail" href={post.url} key={post.url}>
            <div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </div>
          </a>
        ))}
      </div>
    </>
  )
}
