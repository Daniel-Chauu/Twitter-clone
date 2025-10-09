import { Router } from 'express'
import authRoute from './auth.route'
import { errorHandler } from '~/utils/defaultErrorHandler'
import userRoute from './user.route'

const rootRoute = Router()

rootRoute.use('/auth', authRoute)

rootRoute.use('/user', userRoute)

rootRoute.use(errorHandler)

export default rootRoute
