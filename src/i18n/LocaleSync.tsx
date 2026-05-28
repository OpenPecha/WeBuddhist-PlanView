import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LANG_QUERY_PARAM, parseAppLocale } from './locale-utils'

/** Keeps i18n in sync when the URL `?lang=` param changes. */
export function LocaleSync() {
  const [searchParams] = useSearchParams()
  const { i18n } = useTranslation()
  const langParam = searchParams.get(LANG_QUERY_PARAM)

  useEffect(() => {
    const locale = parseAppLocale(langParam)
    if (!locale) return
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale)
    }
  }, [langParam, i18n])

  return null
}
