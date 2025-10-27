import { HTTP_STATUS } from './httpStatus'

type SingleError = {
  msg: string
  [key: string]: unknown
}

type ErrorsType = Record<string, SingleError>

export type ValidationErrorResponse = {
  message: string
  errors: ErrorsType
}

export type GeneralErrorResponse = {
  message: string
}

export class ApiError extends Error {
  status: number
  isValidationError: boolean
  validationErrors?: ErrorsType

  constructor(status: number, message: string, validationErrors?: ErrorsType) {
    super(message)
    this.status = status
    this.isValidationError = status === HTTP_STATUS.UNPROCESSABLE_ENTITY
    this.validationErrors = validationErrors

    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export type SuccessResponse<T> = {
  message: string
  data?: T
}
