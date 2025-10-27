import { v2 as cloudinary } from 'cloudinary'
import mongoose from 'mongoose'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE, POST_MESSAGE } from '~/constants/messages'
import { StatusError } from '~/errors/error'
import { Notification } from '~/models/notification.model'
import { Post } from '~/models/post.model'
import { User } from '~/models/user.model'
import { CreatePostReqBody } from '~/utils/request'
import returnedData from '~/utils/returnedData'

class PostService {
  async createPost({ body, user_id }: { body: CreatePostReqBody; user_id: string }) {
    const user = await User.findById(user_id)
    if (!user)
      throw new StatusError({
        message: AUTH_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })

    if (body.img) {
      const uploadedResponse = await cloudinary.uploader.upload(body.img)
      body.img = uploadedResponse.secure_url
    }

    const newPost = new Post({
      user: user_id,
      img: body.img,
      text: body.text
    })

    await newPost.save()

    return returnedData(true, POST_MESSAGE.CREATE_POST_SUCCESSFULLY, { post: newPost })
  }

  async deletePost({ post_id, user_id }: { post_id: string; user_id: string }) {
    const post = await Post.findById(post_id)
    if (!post)
      throw new StatusError({
        message: POST_MESSAGE.POST_NOT_FOUND_OR_ALREADY_DELETED,
        status: HTTP_STATUS.NOT_FOUND
      })

    if (post.user.toString() !== user_id)
      throw new StatusError({
        message: POST_MESSAGE.USER_IS_NOT_AUTHORIZED_TO_DELTE_THIS_POST,
        status: HTTP_STATUS.UNAUTHORIZED
      })

    if (post.img) {
      const img_id = post.img.split('/').pop()?.split('.')[0]
      await cloudinary.uploader.destroy(img_id as string)
    }

    await Post.findByIdAndDelete(post_id)

    return returnedData(true, POST_MESSAGE.POST_DELETED_SUCCESSFULLY, { deleted_post: post })
  }
  async comment({ post_id, user_id, text }: { post_id: string; user_id: string; text: string }) {
    const post = await Post.findById(post_id)
    if (!post)
      throw new StatusError({
        message: POST_MESSAGE.POST_NOT_FOUND_OR_ALREADY_DELETED,
        status: HTTP_STATUS.NOT_FOUND
      })

    const comment = {
      user: new mongoose.Types.ObjectId(user_id),
      text
    }

    post.comments?.push(comment)
    await post.save()

    return returnedData(true, POST_MESSAGE.COMMENT_SUCCESSFULLY, { post })
  }
  async likeUnlike({ post_id, user_id }: { post_id: string; user_id: string }) {
    const post = await Post.findById(post_id)
    if (!post)
      throw new StatusError({
        message: POST_MESSAGE.POST_NOT_FOUND_OR_ALREADY_DELETED,
        status: HTTP_STATUS.NOT_FOUND
      })

    const userId = new mongoose.Types.ObjectId(user_id)

    const isLikedPost = post.likes?.includes(userId)

    if (isLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: post_id }, { $pull: { likes: userId } })
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: post_id } })

      return returnedData(true, POST_MESSAGE.POST_UNLIKED_SUCCESSFULLY)
    } else {
      // Like post
      await post.likes?.push(userId)
      await User.updateOne({ _id: userId }, { $push: { likedPosts: post_id } })
      post.save()

      const notification = new Notification({
        from: user_id,
        to: post.user,
        type: 'like'
      })
      await notification.save()
      return returnedData(true, POST_MESSAGE.POST_LIKED_SUCCESSFULLY)
    }
  }

  async getAllPost() {
    const posts = await Post.find()
      .sort('-createdAt')
      .populate({ path: 'user', select: '_id username profileImg fullname' })
      .populate('comments.user', '_id username profileImg fullname')

    return returnedData(true, POST_MESSAGE.ALL_POST_GOT_SUCCESSFULLY, {
      posts
    })
  }

  async getLikedPost(user_id: string) {
    const user = await User.findById(user_id)
    if (!user)
      throw new StatusError({
        message: AUTH_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })

    const posts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({ path: 'user', select: '_id username profileImg fullname' })
      .populate('comments.user', '_id username profileImg fullname')

    return returnedData(true, POST_MESSAGE.LIKED_POST_GOT_SUCCESSFULLY, {
      posts
    })
  }
  async getFollowingPost(user_id: string) {
    const user = await User.findById(user_id)
    if (!user)
      throw new StatusError({
        message: AUTH_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })

    const posts = await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({ path: 'user', select: '_id username profileImg fullname' })
      .populate('comments.user', '_id username profileImg fullname')

    return returnedData(true, POST_MESSAGE.LIKED_POST_GOT_SUCCESSFULLY, {
      posts
    })
  }
  async getUserPost(username: string) {
    const user = await User.findOne({ username })
    if (!user)
      throw new StatusError({
        message: AUTH_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: 'user', select: '_id username profileImg fullname' })
      .populate('comments.user', '_id username profileImg fullname')

    return returnedData(true, POST_MESSAGE.USER_POST_GOT_SUCCESSFULLY, {
      posts
    })
  }
}

const postService = new PostService()

export default postService
