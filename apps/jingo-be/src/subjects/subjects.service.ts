import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Subject } from './schemas/subject.schema'
import { CreateSubjectDto } from './dtos/create-subject.dto'
import { UpdateSubjectDto } from './dtos/update-subject.dto'

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
  ) {}

  async getAllCount(): Promise<number> {
    return await this.subjectModel.estimatedDocumentCount()
  }

  async findAll(): Promise<Subject[]> {
    return await this.subjectModel.find().lean()
  }

  async create(createDto: CreateSubjectDto): Promise<Subject> {
    return await this.subjectModel.create(createDto)
  }
}
