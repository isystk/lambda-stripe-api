import { Request, Response, NextFunction } from 'express'
import session from 'express-session'

declare module 'express-session' {
  interface SessionData {
    user?: string | undefined
  }
}

export const config = session({
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

// 認証状態をチェックするミドルウェアを作成
export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    // セッションにユーザー情報がある場合は、次のミドルウェアに進む
    return next()
  } else {
    // セッションにユーザー情報がない場合は、ログインページにリダイレクトする
    res.status(401).json({ message: 'Authentication failed.' })
    return
  }
}
