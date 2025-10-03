import { AsyncLocalStorage } from 'async_hooks'
import express from 'express'
import { body, validationResult, ContextRunner, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { EntityError, StatusError } from '~/errors/error'
import { checkEmptyObj } from './utils'

// can be reused by many routes
const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) return next()

    const errorsObj = errors.mapped()
    console.log('🚀 ~ errorsObj:', errorsObj)
    const statusError = new StatusError({ message: '', status: HTTP_STATUS.BAD_REQUEST })
    const entityError = new EntityError({ errors: {} })

    for (const key in errorsObj) {
      const { msg } = errorsObj[key]
      if (msg instanceof StatusError && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        statusError.message = msg.message
        statusError.status = msg.status
      } else {
        entityError.errors[key] = errorsObj[key]
      }
    }

    if (checkEmptyObj(entityError.errors)) return next(statusError)

    return next(entityError)
  }
}

export default validate
