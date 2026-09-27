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
```

## Writing

- Posts live in `content/blog/<folder>/<slug>.md` and are served at `/<folder>/<slug>/`.
- Frontmatter: `title`, `date` (`YYYY-MM-DD HH:mm:ss`), `category`, optional `thumbnail`. Posts without a `category` are not published.
- Put images next to the post (`./images/...`) and reference them with Markdown image syntax so they get optimized.
- Files referenced from raw HTML (`<video>`, `<img>`) must live under `public/media/` and use absolute paths.
- Highlight code lines with `` ```js {1,3-5} ``.

## Notes

- URLs and heading ids are kept identical to the old Gatsby site: Utterances comments are matched by pathname,
  and `src/lib/rehype-legacy-heading-ids.ts` reproduces Gatsby's heading anchors.
- `public/sw.js` unregisters the service worker left over from the Gatsby site. Keep it for a while.
