import { Router } from 'express'
import notificationController from '~/controllers/notification.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'

const notificationRoute = Router()

notificationRoute.get('/', accessTokenValidator, notificationController.getNotifications)

notificationRoute.delete('/', accessTokenValidator, notificationController.deleteNotifications)
notificationRoute.delete('/:id', accessTokenValidator, notificationController.deleteNotification)

export default notificationRoute
