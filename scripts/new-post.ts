// Creates a new post skeleton: `pnpm post`
import fs from 'node:fs/promises'
import path from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

async function getCategories(): Promise<string[]> {
  const files = await fs.readdir(BLOG_DIR, { recursive: true })
  const categories = new Set<string>()
  for (const file of files) {
    if (!file.endsWith('.md')) continue
    const source = await fs.readFile(path.join(BLOG_DIR, file), 'utf8')
    const category = source.match(/^category:\s*['"]?([^'"\n]+)/m)?.[1]?.trim()
    if (category) categories.add(category.toLowerCase())
  }
  return [...categories].sort()
}

const toFileName = (title: string) => title.trim().split(/\s+/).join('-').toLowerCase()

const pad = (n: number) => String(n).padStart(2, '0')
function formatDate(date: Date) {
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  return `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const rl = createInterface({ input, output })

try {
  const categories = await getCategories()
  categories.forEach((category, i) => console.log(`  ${i + 1}) ${category}`))
  const answer = (await rl.question('Category (number or new name): ')).trim()
  const category = categories[Number(answer) - 1] ?? answer
  if (!category || category.includes("'")) throw new Error('Invalid category')

  const title = (await rl.question('Title: ')).trim()
  if (!title || title.includes("'")) throw new Error('Invalid title')

  const dest = path.join(BLOG_DIR, category, `${toFileName(title)}.md`)
  await fs.mkdir(path.dirname(dest), { recursive: true })
  const contents = `---\ntitle: '${title}'\ndate: ${formatDate(new Date())}\ncategory: ${category}\n---\n`
  await fs.writeFile(dest, contents, { flag: 'wx' })

  console.log(`\nCreated ${path.relative(process.cwd(), dest)}`)
  console.log(`Add the English version next to it as ${toFileName(title)}.en.md (see scripts/translation-guide.md).`)
} finally {
  rl.close()
}
