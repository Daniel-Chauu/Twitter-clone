import mongoose, { ObjectId } from 'mongoose'

export interface INotification {
  _id: mongoose.Types.ObjectId
  from: mongoose.Types.ObjectId
  to: mongoose.Types.ObjectId
  type: 'follow' | 'like'
  read?: boolean
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    from: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User'
    },
    to: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['follow', 'like']
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export const Notification = mongoose.model<INotification>('Notification', notificationSchema)
