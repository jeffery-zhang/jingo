import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'

import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './shared/filters/exception.filter'
import { BodyInterceptor } from './shared/interceptors/body.interceptor'

console.log('current environment:', process.env.NODE_ENV)

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: process.env.NODE_ENV === 'prod',
    }),
  )
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(new BodyInterceptor())
  app.use(helmet())

  await app.listen(4444)
}

bootstrap()
