import { Request, Response, Router } from 'express'
import authController from '~/controllers/auth.controller'

const authRoute = Router()

authRoute.post('/signup', authController.signup)
authRoute.post('/login', authController.login)
authRoute.post('/logout', authController.logout)

export default authRoute
