import { SUPPORTED_LOCALES, type AppLocale } from './index'

export const LANG_QUERY_PARAM = 'lang'

export function parseAppLocale(value: string | null | undefined): AppLocale | null {
  if (!value) return null
  const normalized = value.toLowerCase().split('-')[0]
  return SUPPORTED_LOCALES.includes(normalized as AppLocale)
    ? (normalized as AppLocale)
    : null
}

export function withLangParam(path: string, lang: string): string {
  const url = new URL(path, window.location.origin)
  url.searchParams.set(LANG_QUERY_PARAM, lang)
  return `${url.pathname}${url.search}${url.hash}`
}
