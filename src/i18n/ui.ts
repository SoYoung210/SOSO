export const LANGS = ['en', 'ko'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'en'

export const LANG_META: Record<Lang, { label: string; name: string; htmlLang: string; ogLocale: string }> = {
  en: { label: 'EN', name: 'English', htmlLang: 'en', ogLocale: 'en_US' },
  ko: { label: 'KR', name: '한국어', htmlLang: 'ko', ogLocale: 'ko_KR' },
}

const UI = {
  en: {
    homeTitle: 'Home',
    introduction: '📝 A small, casual dev log',
    description: 'A blog about frontend, design systems and the web, by SoYoung.',
    translatedFrom: 'Translated from the',
    koreanOriginal: 'Korean original',
    notFoundTitle: '404: Not Found',
    notFoundHeading: 'Not Found',
    notFoundBody: "You just hit a route that doesn't exist... the sadness.",
    switchLanguage: 'Language',
  },
  ko: {
    homeTitle: 'Home',
    introduction: '📝 소소하게 끄적이는 개발로그',
    description: '프론트엔드, 디자인 시스템, 웹에 대해 기록하는 이소영의 블로그',
    translatedFrom: '',
    koreanOriginal: '',
    notFoundTitle: '404: Not Found',
    notFoundHeading: 'Not Found',
    notFoundBody: '존재하지 않는 페이지입니다.',
    switchLanguage: '언어',
  },
} as const satisfies Record<Lang, Record<string, string>>

export type UIKey = keyof (typeof UI)['en']

export const t = (lang: Lang, key: UIKey): string => UI[lang][key]

export const isLang = (value: string | undefined): value is Lang => LANGS.includes(value as Lang)

export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'ko' : 'en')

// Frontmatter dates have no timezone, so they are read (and shown) as UTC.
export const formatDate = (date: Date, lang: Lang) =>
  date.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  })

/** Localized URLs of the same page, used for the language switch and hreflang tags. */
export type Alternates = Partial<Record<Lang, string>>
