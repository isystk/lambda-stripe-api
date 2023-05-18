import type { InitOptions } from 'i18next'
import i18next from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from '../locales/en/common.json'
import jaCommon from '../locales/ja/common.json'
import React from 'react'

const detector = new LanguageDetector(null, {
  order: ['navigator', 'localStorage'],
})

const option: InitOptions = {
  resources: {
    en: {
      Common: enCommon,
    },
    ja: {
      Common: jaCommon,
    },
  },
}

i18next.use(detector).use(initReactI18next).init(option)

export default i18next
