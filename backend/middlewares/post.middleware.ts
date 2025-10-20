import { checkSchema } from 'express-validator'
import mongoose, { isValidObjectId } from 'mongoose'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { POST_MESSAGE } from '~/constants/messages'
import { StatusError } from '~/errors/error'
import validate from '~/utils/validation'

export const createPostValidator = validate(
  checkSchema(
    {
      img: {
        // notEmpty: { errorMessage: POST_MESSAGE.IMAGE_IS_REQUIRED }
        optional: true
      },
      text: {
        notEmpty: { errorMessage: POST_MESSAGE.TEXT_IS_REQUIRED }
      }
    },
    ['body']
  )
)

export const postIdValidator = validate(
  checkSchema(
    {
      post_id: {
        custom: {
          options: (post_id) => {
            if (!isValidObjectId(post_id))
              throw new StatusError({
                message: POST_MESSAGE.POST_ID_MUST_BE_A_VALID_OBJECT_ID,
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

export const postCommentValidator = validate(
  checkSchema(
    {
      text: {
        notEmpty: { errorMessage: POST_MESSAGE.TEXT_IS_REQUIRED }
      }
    },
    ['body']
  )
)
