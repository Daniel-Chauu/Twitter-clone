import { HTTP_STATUS } from '~/constants/httpStatus'
import { NOTIFICATION_MESSAGE } from '~/constants/messages'
import { StatusError } from '~/errors/error'
import { Notification } from '~/models/notification.model'
import returnedData from '~/utils/returnedData'

class NotificationService {
  async getNotifications(user_id: string) {
    const notifications = await Notification.find({ to: user_id }).populate({
      path: 'from',
      select: 'username profileImg'
    })

    await Notification.updateMany({ to: user_id }, { read: true })

    return returnedData(true, NOTIFICATION_MESSAGE.NOTIFICATIONS_GOT_SUCCESSFULLY, { notifications })
  }
  async deleteNotifications(user_id: string) {
    await Notification.deleteMany({ to: user_id })

    return returnedData(true, NOTIFICATION_MESSAGE.NOTIFICATIONS_DELETED_SUCCESSFULLY)
  }
  async deleteNotification({ notification_id, user_id }: { notification_id: string; user_id: string }) {
    const noti = await Notification.findById(notification_id)

    if (!noti)
      throw new StatusError({
        message: NOTIFICATION_MESSAGE.NOTIFICATION_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })

    if (noti.to.toString() !== user_id)
      throw new StatusError({
        message: NOTIFICATION_MESSAGE.YOU_ARE_NOT_ALLOWED_TO_DELETE,
        status: HTTP_STATUS.UNAUTHORIZED
      })

    await Notification.findByIdAndDelete(notification_id)

    return returnedData(true, NOTIFICATION_MESSAGE.NOTIFICATION_DELETED_SUCCESSFULLY)
  }
}

const notificationService = new NotificationService()

export default notificationService
