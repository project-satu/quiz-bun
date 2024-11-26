import { HttpException } from "@nestjs/common"

export const successResponse = ({ data, isPaginate = false, message = 'success', statusCode = 200 }) => {
  return {
    success: true,
    message: message,
    statusCode: statusCode,
    data: isPaginate ? data.items : data,
    meta: isPaginate ? data.meta : undefined
  }
}

export const errorResponse = (message = 'internal server error', statusCode = 500) => {
  throw new HttpException({
    success: false,
    statusCode: statusCode,
    message: message,
  }, statusCode)
}
