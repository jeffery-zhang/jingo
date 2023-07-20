import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Post, PostSchema } from './schemas/post.schema'
import { SubjectsModule } from '../subjects/subjects.module'
import { CategoriesModule } from '../categories/categories.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    SubjectsModule,
    CategoriesModule,
  ],
})
export class PostsModule {}
