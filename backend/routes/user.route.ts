import { Request, Response, Router } from 'express'
import userController from '~/controllers/user.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { followUnfollowValidator, getUserProfileValidator, updateProfileValidator } from '~/middlewares/user.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const userRoute = Router()

userRoute.get('/profile/:username', getUserProfileValidator, wrapRequestHandler(userController.getUserProfile))

userRoute.post(
  '/follow/:followed_user_id',
  accessTokenValidator,
  followUnfollowValidator,
  wrapRequestHandler(userController.followUnfollowUser)
)

userRoute.get('/suggested', accessTokenValidator, wrapRequestHandler(userController.getSuggestedUser))

userRoute.patch(
  '/update',
  accessTokenValidator,
  updateProfileValidator,
  wrapRequestHandler(userController.updateProfile)
)

export default userRoute
