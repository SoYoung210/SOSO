// Structural checks for English translations: `pnpm check:translations [--all] [files...]`
// Compares every `<slug>.en.md` with its Korean `<slug>.md` source (see scripts/translation-guide.md).
import fs from 'node:fs'
import path from 'node:path'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')
const HANGUL = /[ㄱ-ㆎ가-힣]/
const FENCE = /^\s*(`{3,}|~{3,})(.*)$/
// Phrases that make a translation read as machine-written (see "Writing like a person" in the guide).
const AVOID = [
  /\bgenuinely\b/i,
  /\btruly\b/i,
  /\bwholeheartedly\b/i,
  /\bdelv(e|es|ing)\b/i,
  /(?<!-)\bjourney\b(?!-)/i, // but not names like `threejs-journey`
  /\bsteeped in\b/i,
  /\btapestry\b/i,
  /\bcrucial\b/i,
  /\bpivotal\b/i,
  /\bseamless(ly)?\b/i,
  /\ba testament to\b/i,
  /\bnavigat(e|ing) the complexit/i,
  /\bin today's\b/i,
  /\ball sorts of\b/i,
  /\bnot (just |only )?[^.—]{1,40} — (it's|it is|but)\b/i,
]
const WORDS_PER_EM_DASH = 150

interface Parsed {
  frontmatter: Record<string, string>
  headings: string[]
  fences: { info: string; lines: number }[]
  targets: string[]
  hangulLines: number[]
  prose: string
}

function parse(source: string): Parsed {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/)
  const frontmatter: Record<string, string> = {}
  for (const line of match?.[1].split('\n') ?? []) {
    const [, key, value] = line.match(/^(\w+):\s*(.*)$/) ?? []
    if (key) frontmatter[key] = value
  }

  const body = source.slice(match?.[0].length ?? 0)
  const offset = (match?.[0].split('\n').length ?? 1) - 1
  const parsed: Parsed = { frontmatter, headings: [], fences: [], targets: [], hangulLines: [], prose: '' }
  let fence: { marker: string; info: string; lines: number } | null = null

  body.split('\n').forEach((line, index) => {
    const fenceMatch = line.match(FENCE)
    if (fence) {
      if (fenceMatch && fenceMatch[1].startsWith(fence.marker) && !fenceMatch[2].trim()) {
        parsed.fences.push({ info: fence.info, lines: fence.lines })
        fence = null
      } else {
        fence.lines++
      }
      return
    }
    if (fenceMatch) {
      fence = { marker: fenceMatch[1], info: fenceMatch[2].trim(), lines: 0 }
      return
    }

    const heading = line.match(/^(#{1,6})\s/) ?? line.match(/<h([1-6])[\s>]/i)
    if (heading) parsed.headings.push(heading[1].startsWith('#') ? `h${heading[1].length}` : `h${heading[1]}`)

    for (const m of line.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) parsed.targets.push(m[1])
    for (const m of line.matchAll(/\b(?:src|href|poster)=["']([^"']+)["']/g)) parsed.targets.push(m[1])

    parsed.prose += `${line.replace(/`[^`]*`/g, '').replace(/\]\([^)]*\)/g, ']')}\n`
    const withoutUrls = line
      .replace(/\]\([^)]*\)/g, '](')
      .replace(/\b(?:src|href|poster)=["'][^"']*["']/g, '')
      .replace(/`[^`]*`/g, '')
    if (HANGUL.test(withoutUrls)) parsed.hangulLines.push(index + offset + 1)
  })

  return parsed
}

function compare(koFile: string, enFile: string): { errors: string[]; warnings: string[] } {
  const ko = parse(fs.readFileSync(koFile, 'utf8'))
  const en = parse(fs.readFileSync(enFile, 'utf8'))
  const errors: string[] = []
  const warnings: string[] = []

  for (const key of new Set([...Object.keys(ko.frontmatter), ...Object.keys(en.frontmatter)])) {
    if (key === 'title') continue
    if (ko.frontmatter[key] !== en.frontmatter[key]) {
      errors.push(`frontmatter "${key}": ${ko.frontmatter[key]} → ${en.frontmatter[key]}`)
    }
  }
  if (!en.frontmatter.title) errors.push('frontmatter "title" is missing')
  else if (HANGUL.test(en.frontmatter.title)) warnings.push('title still contains Hangul')

  if (ko.headings.join() !== en.headings.join()) {
    errors.push(`headings differ: ko [${ko.headings.join(' ')}] vs en [${en.headings.join(' ')}]`)
  }

  if (ko.fences.length !== en.fences.length) {
    errors.push(`code block count: ko ${ko.fences.length} vs en ${en.fences.length}`)
  } else {
    ko.fences.forEach((block, i) => {
      const other = en.fences[i]
      if (block.info !== other.info) errors.push(`code block #${i + 1} info: "${block.info}" → "${other.info}"`)
      if (block.lines !== other.lines) errors.push(`code block #${i + 1} lines: ${block.lines} → ${other.lines}`)
    })
  }

  const missing = ko.targets.filter((t) => !en.targets.includes(t))
  const added = en.targets.filter((t) => !ko.targets.includes(t))
  if (missing.length) errors.push(`link/media targets missing: ${[...new Set(missing)].join(', ')}`)
  if (added.length) errors.push(`link/media targets added: ${[...new Set(added)].join(', ')}`)

  if (en.hangulLines.length) warnings.push(`Hangul outside code on lines ${en.hangulLines.join(', ')}`)

  const words = en.prose.split(/\s+/).filter(Boolean).length
  const emDashes = (en.prose.match(/—/g) ?? []).length
  if (emDashes > Math.max(1, Math.ceil(words / WORDS_PER_EM_DASH))) {
    warnings.push(`style: ${emDashes} em dashes in ${words} words (max ~1 per ${WORDS_PER_EM_DASH})`)
  }
  for (const pattern of AVOID) {
    const hits = en.prose.match(new RegExp(pattern.source, 'gi'))
    if (hits) warnings.push(`style: avoid "${hits[0]}"${hits.length > 1 ? ` (${hits.length}×)` : ''}`)
  }
  return { errors, warnings }
}

const args = process.argv.slice(2)
const requireAll = args.includes('--all')
const only = args.filter((a) => !a.startsWith('--')).map((a) => path.resolve(a))

const sources = fs
  .readdirSync(BLOG_DIR, { recursive: true, encoding: 'utf8' })
  .filter((f) => f.endsWith('.md') && !f.endsWith('.en.md'))
  .map((f) => path.join(BLOG_DIR, f))
  .filter((f) => !only.length || only.includes(f) || only.includes(f.replace(/\.md$/, '.en.md')))
  .sort()
const optedOut = sources.filter((f) => /^translate:\s*false\s*$/m.test(fs.readFileSync(f, 'utf8'))).length

let failed = 0
let warned = 0
let translated = 0
for (const koFile of sources) {
  const enFile = koFile.replace(/\.md$/, '.en.md')
  const rel = path.relative(process.cwd(), enFile)
  if (!fs.existsSync(enFile)) {
    if (/^translate:\s*false\s*$/m.test(fs.readFileSync(koFile, 'utf8'))) continue
    if (requireAll) {
      failed++
      console.log(`✗ ${rel}\n    missing translation`)
    }
    continue
  }
  translated++
  const { errors, warnings } = compare(koFile, enFile)
  if (errors.length) failed++
  if (warnings.length) warned++
  if (errors.length || warnings.length) {
    console.log(`${errors.length ? '✗' : '!'} ${rel}`)
    errors.forEach((e) => console.log(`    error: ${e}`))
    warnings.forEach((w) => console.log(`    warn:  ${w}`))
  }
}

console.log(`\n${translated}/${sources.length - optedOut} translated (${optedOut} Korean-only), ${failed} failing, ${warned} with warnings`)
process.exit(failed ? 1 : 0)
