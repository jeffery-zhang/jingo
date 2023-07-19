import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { ResponseBody } from '../entities/body.entity'

@Injectable()
export class BodyInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseBody> {
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse()
        const status = res.statusCode
        const success = status >= 200 && status < 300
        const getResponseMessage = () => {
          if (res.message) return res.message
          return data.message ?? ''
        }
        return new ResponseBody(success, getResponseMessage(), status, data)
      }),
    )
  }
}
