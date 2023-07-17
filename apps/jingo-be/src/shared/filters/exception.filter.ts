import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    const getExceptionMessage = () => {
      const res = exception.getResponse()
      if (!res && exception.message) return exception.message
      if (typeof res === 'string') return res
      if (typeof res === 'object' && (res as any).message)
        return (res as any).message
      return ''
    }

    response.status(status).json({
      success: false,
      message: getExceptionMessage(),
      data: [],
      status,
    })
  }
}
