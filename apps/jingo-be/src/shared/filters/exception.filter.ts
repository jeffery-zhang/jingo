import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { MongooseError } from 'mongoose'
import { MongoError } from 'mongodb'

import { ResponseBody } from '../entities/body.entity'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal Server Error'

    console.log('exception filter catched: ', exception)
    console.log('exception constructor: ', exception.constructor)

    const getHttpExceptionMessage = () => {
      const res = (exception as HttpException).getResponse()
      if (!res && (exception as HttpException).message)
        return (exception as HttpException).message
      if (typeof res === 'string') return res
      if (typeof res === 'object' && (res as any).message)
        return (res as any).message
      return ''
    }

    const getMongooseExceptionMessage = () =>
      (exception as MongooseError).name || 'Mongoose Error'

    const getMongoExceptionMessage = () =>
      (exception as MongoError).name || 'Mongo Error'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      message = getHttpExceptionMessage()
    } else if (exception instanceof MongooseError) {
      status = HttpStatus.BAD_REQUEST
      message = getMongooseExceptionMessage()
    } else if (exception instanceof MongoError) {
      status = HttpStatus.BAD_REQUEST
      message = getMongoExceptionMessage()
    }

    response.status(status).json(new ResponseBody(false, message, status, []))
  }
}
