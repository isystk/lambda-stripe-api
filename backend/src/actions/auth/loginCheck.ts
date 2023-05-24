import { Request, Response } from 'express'

// ログインチェック
const loginCheck = async (req: Request, res: Response) => {
  if (!req.session || !req.session.user) {
    res.status(401).json({ message: 'Authentication failed.' })
    // res.redirect(`${ORIGIN_URL}/admin/login`)
    return
  }
  const user = { userName: req.session.user }
  res.json(user)
}

export { loginCheck }
