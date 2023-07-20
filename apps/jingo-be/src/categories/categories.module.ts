import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Category, CategorySchema } from './schemas/category.schema'
import { CategoriesService } from './categories.service'
import { CategoriesController } from './categories.controller'
import { SubjectsModule } from '../subjects/subjects.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    SubjectsModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
