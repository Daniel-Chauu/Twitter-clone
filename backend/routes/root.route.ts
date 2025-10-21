import { Router } from 'express'
import authRoute from './auth.route'
import { errorHandler } from '~/utils/defaultErrorHandler'
import userRoute from './user.route'
import postRoute from './post.route'
import notificationRoute from './notification.route'

const rootRoute = Router()

rootRoute.use('/auth', authRoute)

rootRoute.use('/users', userRoute)

rootRoute.use('/posts', postRoute)

rootRoute.use('/notifications', notificationRoute)

rootRoute.use(errorHandler)

export default rootRoute
