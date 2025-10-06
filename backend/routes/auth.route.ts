import { Router } from 'express'
import authController from '~/controllers/auth.controller'
import { accessTokenValidator, loginValidator, signupValidator } from '~/middlewares/auth.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const authRoute = Router()

authRoute.post('/signup', signupValidator, wrapRequestHandler(authController.signup))

authRoute.post('/login', loginValidator, wrapRequestHandler(authController.login))

authRoute.post('/logout', accessTokenValidator, authController.logout)

authRoute.get('/me', accessTokenValidator, wrapRequestHandler(authController.getMe))

export default authRoute
