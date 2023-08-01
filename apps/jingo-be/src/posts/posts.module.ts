import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CacheModule } from '@nestjs/cache-manager'

import { Post, PostSchema } from './schemas/post.schema'
import { UsersModule } from '../users/users.module'
import { SubjectsModule } from '../subjects/subjects.module'
import { CategoriesModule } from '../categories/categories.module'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    CacheModule.register({
      ttl: 1000 * 60 * 30,
    }),
    UsersModule,
    SubjectsModule,
    CategoriesModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
