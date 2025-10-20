import mongoose, { ObjectId } from 'mongoose'

export interface IUser {
  _id: mongoose.Types.ObjectId
  username: string
  fullname: string
  password: string
  email: string
  followers?: mongoose.Types.ObjectId[]
  following?: mongoose.Types.ObjectId[]
  likedPosts?: mongoose.Types.ObjectId[]
  profileImg?: string
  coverImg?: string
  bio?: string
  link?: string
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    fullname: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minLength: 6
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: []
      }
    ],
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: []
      }
    ],
    profileImg: {
      type: String,
      default: ''
    },
    coverImg: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    likedPosts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        default: []
      }
    ]
  },
  {
    timestamps: true
  }
)

export const User = mongoose.model<IUser>('User', userSchema)
