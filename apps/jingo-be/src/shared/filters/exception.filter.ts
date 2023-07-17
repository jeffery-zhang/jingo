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
    console.log('lets see exception response: ', exception.getResponse())
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    const getExceptionMessage = () => {
      if (exception.message) return exception.message
      const res = exception.getResponse()
      if (typeof res === 'string') return res
      if (typeof res === 'object') return (res as any).message
    }

    response.status(status).json({
      success: false,
      message: getExceptionMessage(),
      data: [],
      status,
    })
  }
}
