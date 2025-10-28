import { Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE } from '~/constants/messages'
import { IUser } from '~/models/user.model'
import authService from '~/services/auth.service'
import { setCookie } from '~/utils/cookie'
import { TokenPayload } from '~/utils/jwt'
import { LoginReqBody, SignupReqBody } from '~/utils/request'
import { omit } from '~/utils/utils'

const authController = {
  signup: async (req: Request<any, any, SignupReqBody>, res: Response) => {
    const body = req.body

    const response = await authService.signup(body)

    setCookie({ name: 'access_token', value: response?.data.access_token, res })

    res.status(HTTP_STATUS.CREATED).json(response)
  },
  login: async (req: Request<any, any, LoginReqBody>, res: Response) => {
    const user = req.user as IUser

    const response = await authService.login(user._id)

    setCookie({ name: 'access_token', value: response?.data.access_token, res })

    res.status(HTTP_STATUS.OK).json({
      ...response,
      data: {
        access_token: response.data.access_token,
        user: {
          _id: user._id,
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          followers: user.followers,
          following: user.following,
          profileImg: user.profileImg,
          coverImg: user.coverImg
        }
      }
    })
  },
  logout: async (req: Request, res: Response) => {
    res.cookie('access_token', '', { maxAge: 0 })
    res.status(HTTP_STATUS.OK).json({ message: AUTH_MESSAGE.LOGOUT_SUCCESS })
  },
  getMe: async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload

    const response = await authService.getMe(user_id)

    res.status(HTTP_STATUS.OK).json(response)
  }
}

export default authController
