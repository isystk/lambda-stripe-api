import { Request, Response } from 'express'
import { ADMIN_USER, ADMIN_PASSWORD } from '../../constants'

// ログイン処理
const login = async (req: Request, res: Response) => {
  const { user, password } = {
    user: req.body['user'],
    password: req.body['password'],
  }
  if (user !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    res.status(401).json({ message: 'Authentication failed.' })
    return
  }
  if (!req.session) {
    throw new Error('An unexpected error has occurred.')
  }
  req.session.user = user
  // res.redirect(`${ORIGIN_URL}/admin/home`)
  res.json({ user })
}

export { login }
