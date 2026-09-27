// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import expressiveCode from 'astro-expressive-code'
import { rehypeHeadingIds, unified } from '@astrojs/markdown-remark'
import remarkEmoji from 'remark-emoji'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

import { sosoCodeTheme } from './src/lib/code-theme.ts'
import { rehypeAnchorIcon } from './src/lib/rehype-anchor-icon.ts'
import { rehypeLegacyHeadingIds } from './src/lib/rehype-legacy-heading-ids.ts'

export default defineConfig({
  site: 'https://so-so.dev',
  // Gatsby served every page as `/<path>/`. Utterances maps comments by pathname,
  // so this must never change.
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    expressiveCode({
      themes: [sosoCodeTheme],
      styleOverrides: {
        codeFontWeight: '500',
        codeFontSize: '0.85rem',
        codeLineHeight: '1.6',
        codeFontFamily: "'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
        borderRadius: '0.6em',
        // line highlight color of the old Prism theme
        textMarkers: { markBackground: 'hsla(207, 95%, 15%, 1)', markBorderColor: '#0687f0' },
      },
      defaultProps: { wrap: false },
    }),
    react(),
    sitemap(),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkEmoji],
      rehypePlugins: [
        rehypeLegacyHeadingIds,
        rehypeHeadingIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'prepend',
            properties: { className: ['anchor', 'before'], ariaHidden: true, tabIndex: -1 },
            content: rehypeAnchorIcon,
          },
        ],
      ],
    }),
  },
})
