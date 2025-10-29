import { Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import postService from '~/services/post.service'
import { CreatePostReqBody, GetUserPostParams, PostCommentReqBody, PostIdParams } from '~/utils/request'

const postController = {
  createPost: async (req: Request<any, any, CreatePostReqBody>, res: Response) => {
    const response = await postService.createPost({
      body: req.body,
      user_id: req.decoded_authorization?.user_id as string
    })

    res.status(HTTP_STATUS.CREATED).json(response)
  },
  deletePost: async (req: Request<PostIdParams>, res: Response) => {
    const { post_id } = req.params
    const user_id = req.decoded_authorization?.user_id as string

    const response = await postService.deletePost({
      user_id,
      post_id
    })

    res.status(HTTP_STATUS.OK).json(response)
  },
  comment: async (req: Request<PostIdParams, any, PostCommentReqBody>, res: Response) => {
    const { post_id } = req.params
    const user_id = req.decoded_authorization?.user_id as string
    const { text } = req.body

    const response = await postService.comment({
      user_id,
      post_id,
      text
    })

    res.status(HTTP_STATUS.OK).json(response)
  },
  likeUnlike: async (req: Request<PostIdParams>, res: Response) => {
    const { post_id } = req.params
    const user_id = req.decoded_authorization?.user_id as string

    const response = await postService.likeUnlike({
      user_id,
      post_id
    })

    res.status(HTTP_STATUS.OK).json(response)
  },
  getAllPost: async (req: Request<PostIdParams>, res: Response) => {
    const { post_id } = req.params
    const user_id = req.decoded_authorization?.user_id as string

    const response = await postService.getAllPost()

    res.status(HTTP_STATUS.OK).json(response)
  },
  getLikedPost: async (req: Request, res: Response) => {
    const { user_id } = req.params

    const response = await postService.getLikedPost(user_id)

    res.status(HTTP_STATUS.OK).json(response)
  },
  getFollowingPost: async (req: Request, res: Response) => {
    const user_id = req.decoded_authorization?.user_id as string

    const response = await postService.getFollowingPost(user_id)

    res.status(HTTP_STATUS.OK).json(response)
  },
  getUserPost: async (req: Request<GetUserPostParams>, res: Response) => {
    const { username } = req.params

    const response = await postService.getUserPost(username)

    res.status(HTTP_STATUS.OK).json(response)
  }
}

export default postController
