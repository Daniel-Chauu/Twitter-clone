import { CookieOptions, Response } from 'express'
import 'dotenv/config'

export const setCookie = ({
  name,
  value,
  options = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development'
  },
  res
}: {
  name: string
  value: string
  options?: CookieOptions
  res: Response
}) => {
  res.cookie(name, value, options)
}
