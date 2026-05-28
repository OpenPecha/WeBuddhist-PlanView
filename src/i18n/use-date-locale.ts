import { useTranslation } from 'react-i18next'
import { enUS, hi, zhCN, type Locale } from 'date-fns/locale'
import type { AppLocale } from './index'

const DATE_LOCALES: Record<AppLocale, Locale> = {
  en: enUS,
  hi,
  zh: zhCN,
  bo: enUS,
}

export function useDateLocale(): Locale {
  const { i18n } = useTranslation()
  const lng = i18n.language as AppLocale
  return DATE_LOCALES[lng] ?? enUS
}
