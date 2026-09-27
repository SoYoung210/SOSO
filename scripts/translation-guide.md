# Translation guide (Korean → English)

English is the default language of so-so.dev. Every Korean post `content/blog/<folder>/<slug>.md`
gets an English sibling `content/blog/<folder>/<slug>.en.md`. The Korean file is the source of truth
and is never edited during translation.

Run `pnpm check:translations` after translating. It enforces the structural rules below.

## Voice

- Write natural, fluent English as if the author had written it in English: first person, same tone
  (casual essays stay casual, technical posts stay precise). Do not translate word for word.
- Keep names of people, companies, products, libraries and talks as they are (Toss, flex, FEConf, ...).
  Add a short clarification only where a Korean-specific reference would otherwise be meaningless.
- Keep the author's emphasis (bold/italic), lists, quotes and emoji.

## Frontmatter

- Translate `title` only. Keep it single-quoted: `title: '...'` (escape `'` as `''`).
- Copy `date`, `category` and `thumbnail` byte for byte. Add no new fields.
- A Korean post with `translate: false` stays Korean-only (e.g. it is itself a translation); its English URL
  redirects to `/ko/...`.

## Structure (checked by the script)

- Same headings, same order, same levels. Translate the heading text; never add, drop, merge or split
  headings. (English pages map old Korean `#anchor` links to English headings by position.)
- Same number of fenced code blocks, and each block keeps **exactly the same number of lines**.
  Fence info strings stay identical (e.g. ` ```jsx {4,7} `), so highlighted lines still line up.
- Inside code, translate only Korean comments and Korean strings/prose. Never change identifiers,
  logic, URLs or whitespace structure.
- Keep every image, `<img>`, `<video>`, `<source>`, `<iframe>`, `<details>`, `<summary>`, `<sup>`,
  `<br/>` and `<div>` in place. Translate visible text and `alt`/`title` attributes, not `src`/`href`.
- Link targets stay byte for byte identical, including `https://so-so.dev/...#한글-anchor` links.
  Translate only the link text.
- Inline code (`` `like this` ``) stays untouched unless it contains Korean prose.

## Output

- Write only the `.en.md` file next to the source. UTF-8, LF line endings, trailing newline.
