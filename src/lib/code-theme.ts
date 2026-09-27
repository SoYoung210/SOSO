import { ExpressiveCodeTheme } from 'astro-expressive-code'

// The customized "Tomorrow Night Eighties" Prism palette the Gatsby site used.
export const sosoCodeTheme = new ExpressiveCodeTheme({
  name: 'soso-prism',
  type: 'dark',
  colors: {
    'editor.background': '#242323',
    'editor.foreground': '#e0e0e0',
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#7a8390' } },
    { scope: ['punctuation', 'meta.brace'], settings: { foreground: '#e0e0e0' } },
    {
      scope: ['entity.name.tag', 'entity.other.attribute-name', 'markup.deleted', 'support.class.component'],
      settings: { foreground: '#e2777a' },
    },
    {
      scope: ['constant.numeric', 'constant.language.boolean', 'entity.name.function', 'support.function'],
      settings: { foreground: '#ff9100' },
    },
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'support.type.property-name',
        'variable.other.constant',
        'constant.other',
      ],
      settings: { foreground: '#ffff00' },
    },
    {
      scope: [
        'keyword',
        'storage',
        'storage.type',
        'entity.other.attribute-name.class',
        'support.type.builtin',
        'constant.language',
      ],
      settings: { foreground: '#b388ff' },
    },
    { scope: ['string', 'string.regexp', 'markup.inserted'], settings: { foreground: '#00e676' } },
    {
      scope: ['keyword.operator', 'markup.underline.link', 'constant.character.entity'],
      settings: { foreground: '#67cdcc' },
    },
    { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
    { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
  ],
})
