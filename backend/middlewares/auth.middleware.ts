import { checkSchema } from 'express-validator'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { StatusError } from '~/errors/error'
import validate from '~/utils/validation'

export const signupValidator = validate(
  checkSchema({
    name: {
      custom: {
        options: (value) => {
          throw new StatusError({
            message: 'Name is required',
            status: HTTP_STATUS.BAD_REQUEST
          })
        }
      }
    }
  })
)
