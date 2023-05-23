import { Application, Request, Response } from 'express'
import session from 'express-session'

declare module 'express-session' {
  interface SessionData {
    firstAccessTime?: string
    counter?: number
    message?: string
    user?: string | undefined
  }
}

const config = session({
  secret: 's3Cur3',
  name: 'session', // default: connect.sid
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/', // default
    httpOnly: true, // default
    maxAge: 10 * 60 * 1000, // 10分
  },
})

export default (app: Application) => {
  // セッションの設定
  app.use(config)
  // セッションの状態が判りやすいようにしておく
  app.use((req: Request, _res: Response, next) => {
    if (!req.session.firstAccessTime) {
      const now = new Date()
      req.session.firstAccessTime = now.toISOString()
    }
    req.session.counter = req.session.counter ? req.session.counter + 1 : 1
    next()
  })
  // セッションの動作確認用 以下のコマンドで動作します
  // curl -XPOST -c cookie.txt -b cookie.txt -i -H 'Content-Type: application/json' localhost:3000/session-test -d '{"message": "Hello Express-Session"}'
  app.post('/session-test', (req: Request, res: Response) => {
    const message = req.body['message']
    req.session.message = message
    res.json({
      firstAccessTime: req.session.firstAccessTime,
      counter: req.session.counter,
      message: req.session.message,
    })
  })

  // ログイン処理
  app.post('/login', async (req: Request, res: Response) => {
    const { user, password } = {
      user: req.body['user'],
      password: req.body['password'],
    }
    if (
      user !== process.env.ADMIN_USER ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      res.status(401).json({ message: 'Authentication failed.' })
      return
    }
    if (!req.session) {
      throw new Error('An unexpected error has occurred.')
    }
    req.session.user = user
    // res.redirect(`${ORIGIN_URL}/admin/home`)
    res.json({ user })
  })

  // ログインチェック
  app.post('/login-check', async (req: Request, res: Response) => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ message: 'Authentication failed.' })
      // res.redirect(`${ORIGIN_URL}/admin/login`)
      return
    }
    const user = { userName: req.session.user }
    res.json(user)
  })

  // ログアウト
  app.post('/logout', async (req: Request, res: Response) => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ message: 'Authentication failed.' })
      return
    }
    req.session.user = undefined
    // res.redirect(`${ORIGIN_URL}/admin/login`)
    res.sendStatus(200)
  })
}

// 認証状態をチェックするミドルウェアを作成
export const checkAuth = (req: Request, res: Response, next) => {
  if (req.session.user) {
    // セッションにユーザー情報がある場合は、次のミドルウェアに進む
    return next()
  } else {
    // セッションにユーザー情報がない場合は、ログインページにリダイレクトする
    res.status(401).json({ message: 'Authentication failed.' })
    return
  }
}
