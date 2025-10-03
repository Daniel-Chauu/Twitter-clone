import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE } from '~/constants/messages'

type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

export class StatusError {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class EntityError extends StatusError {
  errors: ErrorsType
  constructor({
    message = AUTH_MESSAGE.VALIDATION_ERROR,
    status = HTTP_STATUS.UNPROCESSABLE_ENTITY,
    errors
  }: {
    message?: string
    status?: number
    errors: ErrorsType
  }) {
    super({ message, status })
    this.errors = errors
  }
}
