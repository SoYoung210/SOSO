# SOSOLOG

Source of [so-so.dev](https://so-so.dev), built with [Astro](https://astro.build) and deployed on Vercel.

## Development

```sh
nvm use          # Node 24
pnpm install
pnpm dev         # http://localhost:4321
pnpm build       # static output in dist/
pnpm check       # type-check
pnpm post        # create a new post
pnpm check:translations  # compare English translations with their Korean originals
```

## Languages

English is the default language; Korean lives under `/ko/`.

| Page  | English             | Korean                 |
| ----- | ------------------- | ---------------------- |
| Home  | `/`                 | `/ko/`                 |
| Post  | `/<folder>/<slug>/` | `/ko/<folder>/<slug>/` |
| About | `/about/`           | `/ko/about/`           |
| RSS   | `/rss.xml`          | `/ko/rss.xml`          |

- Korean originals are `content/blog/<folder>/<slug>.md`; English translations sit next to them as `<slug>.en.md`
  and follow [`scripts/translation-guide.md`](scripts/translation-guide.md).
- A Korean post marked `translate: false` stays Korean-only; its English URL redirects to `/ko/...`.
- UI strings live in `src/i18n/ui.ts`. Pages are thin routes over the shared views in `src/views/`.
- Both languages share one Utterances thread per post, and English pages still resolve the old Korean
  heading anchors (`#한글-anchor`) by mapping headings by position.

## Writing

- Posts live in `content/blog/<folder>/<slug>.md`.
- Frontmatter: `title`, `date` (`YYYY-MM-DD HH:mm:ss`), `category`, optional `thumbnail`. Posts without a `category` are not published.
- Put images next to the post (`./images/...`) and reference them with Markdown image syntax so they get optimized.
- Files referenced from raw HTML (`<video>`, `<img>`) must live under `public/media/` and use absolute paths.
- Highlight code lines with ` ```js {1,3-5} `.

## Notes

- Utterances issues are titled with the Gatsby-era path (`react/scoped-context/`, percent-encoded for Korean
  filenames); `src/components/Utterances.astro` passes that as the issue term for both languages.
- `src/lib/rehype-legacy-heading-ids.ts` reproduces Gatsby's heading anchors, so old `#anchor` links keep working.
- `public/sw.js` unregisters the service worker left over from the Gatsby site. Keep it for a while.
