import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Subject, SubjectSchema } from './schemas/subject.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
  ],
})
export class SubjectsModule {}
