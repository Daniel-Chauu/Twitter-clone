import { checkSchema, ParamSchema } from 'express-validator'
import mongoose, { isValidObjectId } from 'mongoose'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE, USER_MESSAGE } from '~/constants/messages'
import { REGEX_USERNAME } from '~/constants/regex'
import { StatusError } from '~/errors/error'
import authService from '~/services/auth.service'
import validate from '~/utils/validation'

const password: ParamSchema = {
  optional: true,
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1
    },
    errorMessage: AUTH_MESSAGE.PASSWORD_MUST_BE_STRONG
  }
}

export const getUserProfileValidator = validate(
  checkSchema(
    {
      username: {
        custom: {
          options: async (value: string) => {
            if (!value) throw new Error(AUTH_MESSAGE.USER_NAME_IS_REQUIRED)

            const isValidUsername = REGEX_USERNAME.test(value)
            if (!isValidUsername) throw new Error(AUTH_MESSAGE.USERNAME_LENGTH_MUST_BE_FROM_4_TO_50)

            return true
          }
        }
      }
    },
    ['params']
  )
)

export const followUnfollowValidator = validate(
  checkSchema(
    {
      followed_user_id: {
        custom: {
          options: (id: string) => {
            if (!isValidObjectId(id))
              throw new StatusError({
                message: USER_MESSAGE.FOLLOWED_USER_ID_MUST_BE_A_VALID_OBJECT_ID,
                status: HTTP_STATUS.BAD_REQUEST
              })
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const updateProfileValidator = validate(
  checkSchema(
    {
      username: {
        custom: {
          options: async (value: string) => {
            if (value) {
              const isValidUsername = REGEX_USERNAME.test(value)
              if (!isValidUsername) throw new Error(AUTH_MESSAGE.USERNAME_LENGTH_MUST_BE_FROM_4_TO_50)

              const user = await authService.findUser({ username: value })
              if (user)
                throw new StatusError({
                  message: AUTH_MESSAGE.USERNAME_ALREADY_EXISTS,
                  status: HTTP_STATUS.BAD_REQUEST
                })
            }
            return true
          }
        }
      },
      currentPassword: password,
      newPassword: password
    },
    ['body']
  )
)
