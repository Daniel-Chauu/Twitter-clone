import { Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { IUser } from '~/models/user.model'
import userService from '~/services/user.service'
import { TokenPayload } from '~/utils/jwt'
import { FollowUnfollowParams, GetProfileParams, UpdateProfileReqBody } from '~/utils/request'

const userController = {
  getUserProfile: async (req: Request<GetProfileParams>, res: Response) => {
    const { username } = req.params

    const response = await userService.getUserProfile(username)

    res.status(HTTP_STATUS.OK).json(response)
  },
  followUnfollowUser: async (req: Request<FollowUnfollowParams>, res: Response) => {
    const { followed_user_id } = req.params

    const { user_id } = req.decoded_authorization as TokenPayload

    const response = await userService.followUnfollowUser({ followed_user_id, user_id })

    res.status(HTTP_STATUS.OK).json(response)
  },
  getSuggestedUser: async (req: Request<FollowUnfollowParams>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload

    const response = await userService.getSuggestedUser(user_id)

    res.status(HTTP_STATUS.OK).json(response)
  },
  updateProfile: async (req: Request<any, any, UpdateProfileReqBody>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const body = req.body

    const response = await userService.updateProfile(user_id, body)

    res.status(HTTP_STATUS.OK).json(response)
  }
}

export default userController
