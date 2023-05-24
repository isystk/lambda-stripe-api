import express, { Request, Response } from 'express'
const router = express.Router()

// ログイン処理
router.post('/login', async (req: Request, res: Response) => {
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
router.post('/login-check', async (req: Request, res: Response) => {
  if (!req.session || !req.session.user) {
    res.status(401).json({ message: 'Authentication failed.' })
    // res.redirect(`${ORIGIN_URL}/admin/login`)
    return
  }
  const user = { userName: req.session.user }
  res.json(user)
})

// ログアウト
router.post('/logout', async (req: Request, res: Response) => {
  if (!req.session || !req.session.user) {
    res.status(401).json({ message: 'Authentication failed.' })
    return
  }
  req.session.user = undefined
  // res.redirect(`${ORIGIN_URL}/admin/login`)
  res.sendStatus(200)
})

export { router }
