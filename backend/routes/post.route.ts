import { Router } from 'express'
import postController from '~/controllers/post.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { createPostValidator, postCommentValidator, postIdValidator } from '~/middlewares/post.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const postRoute = Router()

postRoute.get('/', accessTokenValidator, postController.getAllPost)

postRoute.get('/likes', accessTokenValidator, postController.getLikedPost)

postRoute.get('/following', accessTokenValidator, postController.getFollowingPost)

postRoute.get('/user/:username', accessTokenValidator, postController.getUserPost)

postRoute.post('/create', accessTokenValidator, createPostValidator, postController.createPost)

postRoute.post('/like/:post_id', accessTokenValidator, postIdValidator, postController.likeUnlike)

postRoute.delete('/:post_id', accessTokenValidator, postIdValidator, wrapRequestHandler(postController.deletePost))

postRoute.post('/comment/:post_id', accessTokenValidator, postIdValidator, postCommentValidator, postController.comment)

export default postRoute
