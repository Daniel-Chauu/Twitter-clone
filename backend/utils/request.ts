import { IUser } from './../models/user.model'
export type SignupReqBody = IUser

export type LoginReqBody = {
  email: string
  password: string
}
