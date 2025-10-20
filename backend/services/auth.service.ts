import 'dotenv/config'
import mongoose, { ObjectId, RootFilterQuery } from 'mongoose'
import { AUTH_MESSAGE } from '~/constants/messages'
import { IUser, User } from '~/models/user.model'
import { hashPassword } from '~/utils/bcrypt'
import { signToken } from '~/utils/jwt'
import { SignupReqBody } from '~/utils/request'
import returnedData from '~/utils/returnedData'
class AuthService {
  async findUser(cond: RootFilterQuery<IUser>, exclude?: any) {
    return await User.findOne(cond, exclude)
  }

  signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id },
      secretKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
      options: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED_IN as unknown as number }
    })
  }

  async signup({ password, fullname, username, email }: SignupReqBody) {
    const hashedPassword = hashPassword(password)

    const newUser = new User({ fullname, username, email, password: hashedPassword })

    if (newUser) {
      const access_token = await this.signAccessToken(newUser._id.toString())

      await newUser.save()

      return returnedData(true, AUTH_MESSAGE.REGISTER_SUCCESS, {
        access_token,
        user: newUser
      })
    }
  }

  async login(user_id: mongoose.Types.ObjectId) {
    const access_token = await this.signAccessToken(String(user_id))

    return returnedData(true, AUTH_MESSAGE.LOGIN_SUCCESS, {
      access_token
    })
  }

  async getMe(user_id: string) {
    const user = await User.findById(user_id).select('-password')

    return returnedData(true, AUTH_MESSAGE.GET_PROFILE_USER_IS_SUCCESSFULLY, {
      user
    })
  }
}

const authService = new AuthService()

export default authService
