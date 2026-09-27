import GithubSlugger from 'github-slugger'
import type { Element, ElementContent, Root } from 'hast'
import { visit } from 'unist-util-visit'

const HEADING = /^h[1-6]$/
const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function textOf(nodes: ElementContent[]): string {
  return nodes
    .map((node) => (node.type === 'text' ? node.value : node.type === 'element' ? textOf(node.children) : ''))
    .join('')
}

// gatsby-remark-autolink-headers slugged the heading *after* Prism had turned inline code
// into raw HTML, and kept raw HTML such as `<br/>` verbatim. Existing links depend on those ids
// (e.g. `#step-2-code-classlanguage-textincludedcode여부-결정`), so rebuild them the same way.
function legacyText(nodes: ElementContent[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text') return node.value
      // Raw HTML is still a `raw` node here (rehype-raw runs later).
      if ((node.type as string) === 'raw') return (node as unknown as { value: string }).value
      if (node.type !== 'element') return ''
      if (node.tagName === 'code') return `<code class="language-text">${escapeHtml(textOf(node.children))}</code>`
      return legacyText(node.children)
    })
    .join('')
}

export function rehypeLegacyHeadingIds() {
  return (tree: Root) => {
    const slugger = new GithubSlugger()
    visit(tree, 'element', (node: Element) => {
      if (!HEADING.test(node.tagName) || typeof node.properties.id === 'string') return
      node.properties.id = slugger.slug(legacyText(node.children))
    })
  }
}
