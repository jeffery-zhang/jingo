import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CacheModule } from '@nestjs/cache-manager'

import { Comment, CommentSchema } from './schemas/comment.schema'
import { UsersModule } from '../users/users.module'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { PostsModule } from '../posts/posts.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    CacheModule.register({
      ttl: 1000 * 60 * 60,
    }),
    UsersModule,
    PostsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
