import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CacheModule } from '@nestjs/cache-manager'

import { CommentsModule } from '../comments/comments.module'
import { UsersModule } from '../users/users.module'
import { Reply, ReplySchema } from './schemas/reply.schema'
import { RepliesService } from './replies.service'
import { RepliesController } from './replies.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reply.name, schema: ReplySchema }]),
    CacheModule.register({
      ttl: 1000 * 60 * 60,
    }),
    UsersModule,
    CommentsModule,
  ],
  providers: [RepliesService],
  controllers: [RepliesController],
})
export class RepliesModule {}
