import { v2 as cloudinary } from 'cloudinary'
import mongoose, { RootFilterQuery } from 'mongoose'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE, USER_MESSAGE } from '~/constants/messages'
import { StatusError } from '~/errors/error'
import { Notification } from '~/models/notification.model'
import { IUser, User } from '~/models/user.model'
import { comparePassword, hashPassword } from '~/utils/bcrypt'
import { UpdateProfileReqBody } from '~/utils/request'
import returnedData from '~/utils/returnedData'

class UserService {
  private async findUser(cond: RootFilterQuery<IUser>, select?: string) {
    if (select) return User.findOne(cond).select(select)
    else return User.findOne(cond)
  }

  async getUserProfile(username: string) {
    const user = await this.findUser({ username }, '-password')

    return returnedData(true, USER_MESSAGE.GET_PROFILE_SUCCESS, { user })
  }
  async followUnfollowUser({ followed_user_id, user_id }: { followed_user_id: string; user_id: string }) {
    if (followed_user_id === user_id)
      throw new StatusError({
        message: USER_MESSAGE.YOU_CAN_NOT_FOLLOW_OR_UNFOLLOW_YOURSELF,
        status: HTTP_STATUS.BAD_REQUEST
      })

    const followed_user = await User.findById(followed_user_id)
    const currrent_user = await User.findById(user_id)

    if (!followed_user || !currrent_user)
      throw new StatusError({
        message: AUTH_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })

    const isFollowing = currrent_user.following?.includes(new mongoose.Types.ObjectId(followed_user_id))

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(followed_user_id, { $pull: { followers: user_id } })
      await User.findByIdAndUpdate(user_id, { $pull: { following: followed_user_id } })

      // Todo : return the id of the user as a response
      return returnedData(true, USER_MESSAGE.USER_UNFOLLOWED_SUCCESSFULLY)
    } else {
      // follow user
      await User.findByIdAndUpdate(followed_user_id, { $push: { followers: user_id } })
      await User.findByIdAndUpdate(user_id, { $push: { following: followed_user_id } })

      const notification = new Notification({
        from: user_id,
        to: followed_user_id,
        type: 'follow'
      })

      await notification.save()

      // Todo : return the id of the user as a response
      return returnedData(true, USER_MESSAGE.USER_FOLLOWED_SUCCESSFULLY)
    }
  }

  async getSuggestedUser(user_id: string) {
    const usersFollowedByMe = await User.findById(user_id).select('following')

    const users: IUser[] = await User.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(user_id) }
        }
      },
      {
        $sample: { size: 10 }
      }
    ])

    const filteredUsers = users.filter((user) => !usersFollowedByMe?.following?.includes(user._id))
    const suggestedUsers = filteredUsers.slice(0, 4)
    suggestedUsers.forEach((user) => (user.password = ''))

    return returnedData(true, USER_MESSAGE.GET_SUGGESTED_USER_SUCCESSFULLY, {
      suggested: suggestedUsers
    })
  }

  async updateProfile(user_id: string, body: UpdateProfileReqBody) {
    const user = await User.findById(user_id)
    if (!user)
      throw new StatusError({
        message: AUTH_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })

    if ((!body.newPassword && body.currentPassword) || (body.newPassword && !body.currentPassword))
      throw new StatusError({
        message: USER_MESSAGE.PLEASE_PROVIDE_BOTH_CURRENT_AND_NEW_PASSWORD,
        status: HTTP_STATUS.BAD_REQUEST
      })

    if (body.currentPassword && body.newPassword) {
      const isMatch = await comparePassword(body.currentPassword, user.password)

      if (!isMatch)
        throw new StatusError({
          message: USER_MESSAGE.CURRENT_PASSWORD_IS_INCORRECT,
          status: HTTP_STATUS.BAD_REQUEST
        })

      const hash = await hashPassword(body.newPassword)
      user.password = hash
    }

    if (body.profileImg) {
      if (user.profileImg) {
        const imgId = user.profileImg.split('/').pop()?.split('.')[0] as string
        await cloudinary.uploader.destroy(imgId)
      }
      const uploadedRes = await cloudinary.uploader.upload(body.profileImg)
      body.profileImg = uploadedRes.secure_url
    }

    if (body.coverImg) {
      if (user.coverImg) {
        const imgId = user.coverImg.split('/').pop()?.split('.')[0] as string
        await cloudinary.uploader.destroy(imgId)
      }
      const uploadedRes = await cloudinary.uploader.upload(body.coverImg)
      body.coverImg = uploadedRes.secure_url
    }

    user.fullname = body.fullname || user.fullname
    user.username = body.username || user.username
    user.bio = body.bio || user.bio
    user.link = body.link || user.link
    user.profileImg = body.profileImg || user.profileImg
    user.coverImg = body.coverImg || user.coverImg

    user.save()

    return returnedData(true, USER_MESSAGE.UPDATE_PROFILE_SUCCESS, {
      user
    })
  }
}

const userService = new UserService()

export default userService
