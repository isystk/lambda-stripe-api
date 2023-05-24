import express, { Application } from 'express'
import cors from 'cors'
import { router } from './routes'
import { config } from './utils/session'
import { ORIGIN_URL } from './constants'

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
app.use(router)

// 404エラーハンドリング
app.use((_req, res) => {
  res.status(404).send('404 Not Found').end()
})

export { app }
