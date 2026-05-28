import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import hi from './locales/hi.json'
import zh from './locales/zh.json'
import bo from './locales/bo.json'

export const SUPPORTED_LOCALES = ['en', 'hi', 'zh', 'bo'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const CONTENT_LANGUAGES = ['en', 'hi', 'zh', 'bo'] as const
export type ContentLanguage = (typeof CONTENT_LANGUAGES)[number]

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  zh: { translation: zh },
  bo: { translation: bo },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: [...SUPPORTED_LOCALES],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
      lookupLocalStorage: 'webuddhist-locale',
    },
  })

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
  document.documentElement.classList.toggle('tibetan-font', lng === 'bo')
})

document.documentElement.lang = i18n.language
document.documentElement.classList.toggle('tibetan-font', i18n.language === 'bo')

export default i18n
