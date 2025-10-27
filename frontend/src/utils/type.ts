export type UserType = {
  username: string
  fullname: string
  password: string
  email: string
  followers: never[]
  following: never[]
  profileImg: string
  coverImg: string
  bio: string
  link: string
  likedPosts: never[]
  _id: string
  createdAt: string
  updatedAt: string
  __v: number
}

export type LoginSucessResponse = {
  access_token: string
  user: UserType
}

export type SignUpSucessResponse = {
  access_token: string
  user: UserType
}

export type GetProfileSuccessResponse = {
  user: UserType
}
