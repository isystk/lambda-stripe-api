import { payment as enPayment } from './en/payment'
import { payment as jaPayment } from './ja/payment'
import { cancelRequest as enCancelRequest } from './en/cancelRequest'
import { cancelRequest as jaCancelRequest } from './ja/cancelRequest'
import { cancel as enCancel } from './en/cancel'
import { cancel as jaCancel } from './ja/cancel'
import { midtermCancel as enMidtermCancel } from './en/midtermCancel'
import { midtermCancel as jaMidtermCancel } from './ja/midtermCancel'

const MailNames = [
  'PAYMENT',
  'CANCEL_REQUEST',
  'CANCEL',
  'MIDTERM_CANCEL',
] as const
export type MailNameType = (typeof MailNames)[number]

export type MailType = {
  [key in MailNameType]: MailLanguageType
}

export const Mails: MailType = {
  PAYMENT: {
    ja: jaPayment,
    'ja-JP': jaPayment,
    en: enPayment,
    'en-US': enPayment,
  },
  CANCEL_REQUEST: {
    ja: jaCancelRequest,
    'ja-JP': jaCancelRequest,
    en: enCancelRequest,
    'en-US': enCancelRequest,
  },
  CANCEL: { ja: jaCancel, 'ja-JP': jaCancel, en: enCancel, 'en-US': enCancel },
  MIDTERM_CANCEL: {
    ja: jaMidtermCancel,
    'ja-JP': jaMidtermCancel,
    en: enMidtermCancel,
    'en-US': enMidtermCancel,
  },
}

export const Languages = ['ja', 'ja-JP', 'en', 'en-US'] as const
export type LanguageType = (typeof Languages)[number]

export type Mail = {
  subject: (args?: Record<never, never>) => string
  bodyText: (args?: Record<never, never>) => string
}

export type MailLanguageType = {
  [key in LanguageType]: Mail
}
