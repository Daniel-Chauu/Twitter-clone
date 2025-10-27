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

export type CommentType = {
  _id: string
  text: string
  user: {
    username: string
    profileImg: string
    fullname: string
  }
}
export type PostType =
  | {
      _id: string
      text: string
      img: string
      user: {
        username: string
        profileImg: string
        fullname: string
      }
      comments: CommentType[]
      likes: string[]
    }
  | {
      _id: string
      text: string
      user: {
        username: string
        profileImg: string
        fullname: string
      }
      comments: CommentType[]
      likes: string[]
      img?: string
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

export type GetPostsSuccessReponse = {
  posts: PostType[]
}
