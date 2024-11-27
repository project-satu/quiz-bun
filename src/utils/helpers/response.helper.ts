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

export function valueExists(data: any, dataExists: any) {
  const existingValues = new Set(dataExists.map(cat => cat.value));
  const newData = data.filter(item => !existingValues.has(item.value));

  if (newData.length === 0) {
    throw new Error('Values already existing');
  }
}
