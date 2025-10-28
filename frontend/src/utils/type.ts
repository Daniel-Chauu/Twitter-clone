export type UserType = {
  username: string
  fullname: string
  password: string
  email: string
  followers: string[] | null
  following: string[] | null
  profileImg: string
  coverImg: string
  bio: string
  link: string
  likedPosts: string[] | null
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
      user: Pick<UserType, '_id' | 'fullname' | 'profileImg' | 'username'>
      comments: CommentType[]
      likes: string[]
      createdAt: Date
    }
  | {
      _id: string
      text: string
      user: Pick<UserType, '_id' | 'fullname' | 'profileImg' | 'username'>
      comments: CommentType[]
      likes: string[]
      img?: string
      createdAt: Date
    }

export type Notification = {
  _id: string
  from: {
    _id: string
    username: string
    profileImg: string
  }
  to: string
  type: string
  read: boolean
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

export type GetPostsSuccessReponse = {
  posts: PostType[]
}

export type GetSuggestedUserSuccessReponse = {
  suggested: UserType[]
}

export type LikeSuccessResponse = {
  updatedLikes: string[]
}

export type CommentSuccessResponse = {
  post: PostType
}

export type GetNotificationsSuccessResponse = {
  notifications: Notification[]
}
