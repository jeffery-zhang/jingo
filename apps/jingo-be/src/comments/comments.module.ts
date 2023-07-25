import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CacheModule } from '@nestjs/cache-manager'

import { Comment, CommentSchema } from './schemas/comment.schema'
import { UsersModule } from '../users/users.module'
import { SubjectsModule } from '../subjects/subjects.module'
import { CategoriesModule } from '../categories/categories.module'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { PostsModule } from '../posts/posts.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    CacheModule.register({
      ttl: 1800,
    }),
    UsersModule,
    SubjectsModule,
    CategoriesModule,
    PostsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
