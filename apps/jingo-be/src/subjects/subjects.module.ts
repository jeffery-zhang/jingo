import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Subject, SubjectSchema } from './schemas/subject.schema'
import { SubjectsService } from './subjects.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
  ],
  providers: [SubjectsService],
})
export class SubjectsModule {}
