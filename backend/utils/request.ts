import { IUser } from './../models/user.model'
export type SignupReqBody = IUser

export type LoginReqBody = {
  email: string
  password: string
}

export type GetProfileParams = {
  username: string
}

export type FollowUnfollowParams = {
  followed_user_id: string
}

export type UpdateProfileReqBody = Pick<IUser, 'bio' | 'coverImg' | 'fullname' | 'link' | 'profileImg' | 'username'> & {
  newPassword: string
  currentPassword: string
}

export type CreatePostReqBody = {
  img: string
  text: string
}

export type PostIdParams = {
  post_id: string
}

export type PostCommentReqBody = {
  text: string
}

export type GetUserPostParams = {
  username: string
}
