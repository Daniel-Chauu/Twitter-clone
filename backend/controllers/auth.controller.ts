import { Request, Response } from 'express'

const authController = {
  signup: (req: Request, res: Response) => {
    res.json('Helllo')
  },
  login: (req: Request, res: Response) => {
    res.json('Helllo')
  },
  logout: (req: Request, res: Response) => {
    res.json('Helllo')
  }
}

export default authController
