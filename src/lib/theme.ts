// Same key the Gatsby site used, so returning visitors keep their choice.
export const THEME_KEY = '__felog_local_storage_key__/theme'

export function applyTheme(dark: boolean) {
  document.body.classList.toggle('dark', dark)
  document.body.classList.toggle('light', !dark)
  document.dispatchEvent(new CustomEvent('themechange', { detail: { dark } }))
}
