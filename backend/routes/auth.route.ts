import { Router } from 'express'
import authController from '~/controllers/auth.controller'
import { signupValidator } from '~/middlewares/auth.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const authRoute = Router()

authRoute.post('/signup', signupValidator, wrapRequestHandler(authController.signup))

authRoute.post('/login', authController.login)

authRoute.post('/logout', authController.logout)

export default authRoute
