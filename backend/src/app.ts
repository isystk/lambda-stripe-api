import express, { Application } from 'express'
import cors from 'cors'
import { router as post } from './routes/post'
import { router as auth } from './routes/auth'
import { config } from './actions/session'

const ORIGIN_URL = process.env.ORIGIN_URL ?? ''

const app: Application = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
  cors({
    origin: ORIGIN_URL, //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  })
)
// セッションの設定
app.use(config)

// ルーティング
app.use(post)
app.use(auth)

// 404エラーハンドリング
app.use((_req, res) => {
  res.status(404).send('404 Not Found').end()
})

export { app }
