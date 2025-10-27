import { ApiError, type GeneralErrorResponse, type SuccessResponse, type ValidationErrorResponse } from './errors'
import { HTTP_STATUS } from './httpStatus'

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<SuccessResponse<T>> {
  const response = await fetch(url, options)

  if (response.ok) {
    return (await response.json()) as SuccessResponse<T>
  }

  let errorBody: ValidationErrorResponse | GeneralErrorResponse

  try {
    errorBody = await response.json()
  } catch (error: unknown) {
    throw new ApiError(response.status, `Request failed with status ${response.status} and non-JSON response.`)
  }

  const { status } = response

  if (status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
    const validationError = errorBody as ValidationErrorResponse

    throw new ApiError(status, validationError.message, validationError.errors)
  } else {
    const generalError = errorBody as GeneralErrorResponse
    throw new ApiError(status, generalError.message)
  }
}
