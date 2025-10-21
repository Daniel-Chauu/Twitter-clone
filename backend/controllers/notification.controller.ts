import { Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import notificationService from '~/services/notification.service'
import { TokenPayload } from '~/utils/jwt'
import { DeleteNotiParams } from '~/utils/request'

const notificationController = {
  getNotifications: async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload

    const response = await notificationService.getNotifications(user_id)

    res.status(HTTP_STATUS.OK).json(response)
  },
  deleteNotifications: async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload

    const response = await notificationService.deleteNotifications(user_id)

    res.status(HTTP_STATUS.OK).json(response)
  },
  deleteNotification: async (req: Request<DeleteNotiParams>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { notification_id } = req.params

    const response = await notificationService.deleteNotification({ notification_id, user_id })

    res.status(HTTP_STATUS.OK).json(response)
  }
}

export default notificationController
