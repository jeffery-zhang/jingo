import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Comment, CommentSchema } from './schemas/comment.schema'
import { UsersModule } from '../users/users.module'
import { SubjectsModule } from '../subjects/subjects.module'
import { CategoriesModule } from '../categories/categories.module'
import { PostsController } from './comments.controller'
import { PostsService } from './comments.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    UsersModule,
    SubjectsModule,
    CategoriesModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class CommentsModule {}
