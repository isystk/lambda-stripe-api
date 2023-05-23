import type { InitOptions } from 'i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from '../locales/en/common.json'
import enAdmin from '../locales/en/admin.json'
import jaCommon from '../locales/ja/common.json'
import jaAdmin from '../locales/ja/admin.json'

const detector = new LanguageDetector(null, {
  order: ['navigator', 'localStorage'],
})

const option: InitOptions = {
  resources: {
    en: {
      Common: enCommon,
      Admin: enAdmin,
    },
    ja: {
      Common: jaCommon,
      Admin: jaAdmin,
    },
  },
  fallbackLng: 'ja', // デフォルトのLocaleを英語に設定
}

i18next.use(detector).use(initReactI18next).init(option)

export default i18next
