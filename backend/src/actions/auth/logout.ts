import { Request, Response } from 'express'

// ログアウト
const logout = async (req: Request, res: Response) => {
  if (!req.session || !req.session.user) {
    res.status(401).json({ message: 'Authentication failed.' })
    return
  }
  req.session.user = undefined
  // res.redirect(`${ORIGIN_URL}/admin/login`)
  res.sendStatus(200)
}

export { logout }
