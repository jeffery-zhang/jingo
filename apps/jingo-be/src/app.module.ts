import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'

import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { SubjectsModule } from './subjects/subjects.module'
import { CategoriesModule } from './categories/categories.module'
import { PostsModule } from './posts/posts.module'
import { CommentsModule } from './comments/comments.module'
import { RepliesModule } from './replies/replies.module'
import { ObsModule } from './obs/obs.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DB_FULLPATH'),
        dbName: 'jingo',
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    SubjectsModule,
    CategoriesModule,
    PostsModule,
    CommentsModule,
    RepliesModule,
    ObsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
