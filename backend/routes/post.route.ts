import { Router } from 'express'
import postController from '~/controllers/post.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { createPostValidator, postCommentValidator, postIdValidator } from '~/middlewares/post.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const postRoute = Router()

postRoute.get('/', accessTokenValidator, wrapRequestHandler(postController.getAllPost))

postRoute.get('/following', accessTokenValidator, wrapRequestHandler(postController.getFollowingPost))

postRoute.get('/user/:username', accessTokenValidator, wrapRequestHandler(postController.getUserPost))

postRoute.post('/create', accessTokenValidator, createPostValidator, wrapRequestHandler(postController.createPost))

postRoute.get('/likes/:user_id', accessTokenValidator, wrapRequestHandler(postController.getLikedPost))

postRoute.post('/like/:post_id', accessTokenValidator, postIdValidator, wrapRequestHandler(postController.likeUnlike))

postRoute.delete('/:post_id', accessTokenValidator, postIdValidator, wrapRequestHandler(postController.deletePost))

postRoute.post(
  '/comment/:post_id',
  accessTokenValidator,
  postIdValidator,
  postCommentValidator,
  wrapRequestHandler(postController.comment)
)

export default postRoute
