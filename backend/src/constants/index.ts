import { DynamoDBRecord } from '../utils/dynamodb-client'
import * as process from 'process'

const ORIGIN_URL = process.env.ORIGIN_URL ?? ''
const IS_LOCAL = process.env.IS_LOCAL
const DYNAMODB_ENDPOINT_URL =
  process.env.DYNAMODB_ENDPOINT_URL ?? 'http://localhost:8000'
const STRIPE_SECRET = process.env.STRIPE_SECRET ?? ''
const SMTP_SERVER = process.env.SMTP_SERVER ?? 'localhost'
const SMTP_PORT = process.env.SMTP_PORT ?? '25'
const SMTP_SECURE = process.env.SMTP_SECURE ?? 'false'
const SMTP_USER = process.env.SMTP_USER ?? ''
const SMTP_PASS = process.env.SMTP_PASS ?? ''
const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS ?? ''
const ADMIN_USER = process.env.ADMIN_USER ?? ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? ''

const Status = {
  untreated: 0, // 処理待ち
  contract: 1, // 契約中
  cancelled: 9, // 解約手続き済み
} as const

type Post = {
  customer_id: string
  status: (typeof Status)[keyof typeof Status]
  cancel_token: string | undefined
  cancel_token_at: string | undefined
  cancel_at: string | undefined
} & DynamoDBRecord

export {
  ORIGIN_URL,
  IS_LOCAL,
  DYNAMODB_ENDPOINT_URL,
  STRIPE_SECRET,
  SMTP_SERVER,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM_ADDRESS,
  ADMIN_USER,
  ADMIN_PASSWORD,
  Status,
  Post,
}
