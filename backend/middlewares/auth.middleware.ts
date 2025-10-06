import { Request } from 'express'
import { checkSchema, ParamSchema, Schema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE } from '~/constants/messages'
import { REGEX_EMAIL, REGEX_USERNAME } from '~/constants/regex'
import { StatusError } from '~/errors/error'
import { User } from '~/models/user.model'
import authService from '~/services/auth.service'
import { hashPassword } from '~/utils/bcrypt'
import { verifyToken } from '~/utils/jwt'
import validate from '~/utils/validation'

const password: ParamSchema = {
  notEmpty: { errorMessage: AUTH_MESSAGE.PASSOWRD_IS_REQUIRED },
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

export const signupValidator = validate(
  checkSchema(
    {
      username: {
        custom: {
          options: async (value: string) => {
            if (!value) throw new Error(AUTH_MESSAGE.USER_NAME_IS_REQUIRED)

            const isValidUsername = REGEX_USERNAME.test(value)
            if (!isValidUsername) throw new Error(AUTH_MESSAGE.USERNAME_LENGTH_MUST_BE_FROM_4_TO_50)

            const user = await authService.findUser({ username: value })
            if (user)
              throw new StatusError({
                message: AUTH_MESSAGE.USERNAME_ALREADY_EXISTS,
                status: HTTP_STATUS.BAD_REQUEST
              })

            return true
          }
        }
      },
      fullname: {
        notEmpty: { errorMessage: AUTH_MESSAGE.FULLNAME_IS_REQUIRED }
      },
      email: {
        custom: {
          options: async (value: string) => {
            if (!value) throw new Error(AUTH_MESSAGE.EMAIL_IS_REQUIRED)
            const isValidEmail = REGEX_EMAIL.test(value)

            if (!isValidEmail) throw new Error(AUTH_MESSAGE.EMAIL_IS_INVALID)

            const user = await authService.findUser({ email: value })
            if (user)
              throw new StatusError({
                message: AUTH_MESSAGE.EMAIL_ALREADY_EXISTS,
                status: HTTP_STATUS.BAD_REQUEST
              })

            return true
          }
        }
      },
      password
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value) throw new Error(AUTH_MESSAGE.EMAIL_IS_REQUIRED)
            const isValidEmail = REGEX_EMAIL.test(value)
            if (!isValidEmail) throw new Error(AUTH_MESSAGE.EMAIL_IS_INVALID)
            if (req.body.password) {
              const user = await authService.findUser({ email: value }, { password: 0 })

              if (user) {
                ;(req as Request).user = user
                return true
              }

              throw new StatusError({
                message: AUTH_MESSAGE.EMAIL_OR_PASSWORD_IS_INCORRECT,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
          }
        }
      },
      password
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (token: string, { req }) => {
            if (!token)
              throw new StatusError({
                message: AUTH_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })

            const isBear = token.includes('Bear')
            if (!isBear)
              throw new StatusError({
                message: AUTH_MESSAGE.ACCESS_TOKEN_IS_MALFORMED,
                status: HTTP_STATUS.UNAUTHORIZED
              })

            const access_token = token.split(' ')[1]

            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string
              })

              ;(req as Request).decoded_authorization = decoded_authorization
              return true
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new StatusError({
                  message: error.message,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)
