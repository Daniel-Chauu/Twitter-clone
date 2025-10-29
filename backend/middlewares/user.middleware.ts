import { Request } from 'express'
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
  notEmpty: true,
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
          options: async (value: string, { req }) => {
            if (value) {
              const isValidUsername = REGEX_USERNAME.test(value)
              if (!isValidUsername) throw new Error(AUTH_MESSAGE.USERNAME_LENGTH_MUST_BE_FROM_4_TO_50)

              const user = await authService.findUser({ username: value })
              const decoded = (req as Request).decoded_authorization
              if (user?._id.toString() !== decoded?.user_id)
                throw new StatusError({
                  message: AUTH_MESSAGE.USERNAME_ALREADY_EXISTS,
                  status: HTTP_STATUS.BAD_REQUEST
                })
            }
            return true
          }
        }
      },
      password: {
        // 1. Cho phép trường này được bỏ trống (undefined, null, "")
        // 'checkFalsy: true' rất quan trọng, nó sẽ bỏ qua validation nếu giá trị là chuỗi rỗng.
        optional: { options: { checkFalsy: true } },

        // 2. Nếu trường này CÓ giá trị, nó PHẢI là mật khẩu mạnh
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
      },

      // --- Xử lý cho CURRENT_PASSWORD (MẬT KHẨU HIỆN TẠI) ---
      currentPassword: {
        // Trường này là "bắt buộc có điều kiện"
        custom: {
          options: (value, { req }) => {
            // Lấy giá trị của 'password' (mật khẩu mới) từ body
            const newPassword = req.body.password

            // Kịch bản 1: Nếu người dùng CÓ nhập mật khẩu mới (và nó không phải chuỗi rỗng)
            if (newPassword && newPassword.length > 0) {
              // Thì 'currentPassword' (mật khẩu hiện tại) BẮT BUỘC phải có
              if (!value || value.length === 0) {
                // Ném lỗi nếu 'currentPassword' bị thiếu
                throw new Error('Mật khẩu hiện tại là bắt buộc để thay đổi mật khẩu.')
              }
              // Nếu 'currentPassword' có tồn tại, thì qua vòng check này
              return true
            }

            // Kịch bản 2: Nếu người dùng KHÔNG nhập mật khẩu mới
            // (tức là họ chỉ cập nhật tên, email, v.v.)
            // thì 'currentPassword' không cần thiết.
            return true
          }
        }
        // Bạn cũng có thể thêm các check khác cho currentPassword nếu muốn
        // ví dụ: isString: true, ...
      }
    },
    ['body']
  )
)
