import mongoose from 'mongoose'

type CommentType = {
  text: string
  user: mongoose.Types.ObjectId
}

export interface IPost {
  user: mongoose.Types.ObjectId
  text?: string
  img?: string
  likes?: mongoose.Types.ObjectId[]
  comments?: CommentType[]
}

const postSchema = new mongoose.Schema<IPost>(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String
    },
    img: {
      type: String
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    comments: [
      {
        text: {
          type: String,
          required: true
        },
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

export const Post = mongoose.model<IPost>('Post', postSchema)
