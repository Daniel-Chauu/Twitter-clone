import { Router } from 'express'
import authRoute from './auth.route'
import { errorHandler } from '~/utils/defaultErrorHandler'

const rootRoute = Router()

rootRoute.use('/auth', authRoute)

rootRoute.use(errorHandler)

export default rootRoute
