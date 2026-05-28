import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LANG_QUERY_PARAM, parseAppLocale } from './locale-utils'
import { SUPPORTED_LOCALES, type AppLocale } from './index'

export function useLocale() {
  const { i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const current = (parseAppLocale(i18n.language) ??
    parseAppLocale(searchParams.get(LANG_QUERY_PARAM)) ??
    'en') as AppLocale

  const setLocale = useCallback(
    (lng: AppLocale) => {
      if (!SUPPORTED_LOCALES.includes(lng)) return

      void i18n.changeLanguage(lng)

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set(LANG_QUERY_PARAM, lng)
          return next
        },
        { replace: true },
      )
    },
    [i18n, setSearchParams],
  )

  return { current, setLocale }
}
