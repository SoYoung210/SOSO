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

## Writing like a person (rewrite pass)

The goal is English that reads as if the author had written the post in English in the first place.

- Work paragraph by paragraph from the **Korean meaning**, not sentence by sentence from Korean grammar.
  Restructure, merge, split or reorder sentences within a paragraph whenever it reads better.
- Never add or drop a fact, opinion, example, joke or personal detail. Freer wording, same content.
- Essays and retrospectives: warm, casual, first person, contractions welcome. Technical posts: direct and
  plain; short sentences; say what the code does, then why.
- Cut Korean-style padding: "~하는 것이다" endings, "~라고 생각한다" repeated every sentence, restating the
  previous sentence, "the fact that…", "in order to" where "to" works.
- Use the idiom an English writer would use instead of a literal rendering (e.g. not "pulled things out of their
  bag of gifts" but "happily shared whatever they knew").
- Keep the author's asides exactly as written: `(?)`, `(...)`, `(…)`, `(웃음)`-style jokes rendered as they were.
- Em dashes: at most about one per paragraph. Prefer a comma, a period, a colon or parentheses.
- Avoid these AI-writing tells: genuinely, truly, wholeheartedly, delve, journey, steeped in, tapestry,
  crucial, pivotal, seamless, landscape, "it's not X — it's Y", "In today's …", "all sorts of",
  "a testament to", "navigate the complexities", stacked adverbs.

### Glossary

| Korean | English |
| --- | --- |
| 비전공자 | non-CS-major developer (or "someone without a CS degree") |
| 디자인 시스템 | design system |
| 회고 | retrospective |
| 개발자 경험 (DX) | developer experience (DX) |
| 동료 | teammate / colleague |
| 사내 / 팀 이름, 회사 이름 | keep as written (Toss, flex, Banksalad, Design Platform team, ...) |
