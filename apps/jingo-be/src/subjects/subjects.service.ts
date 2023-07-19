import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  MongoSearchConditions,
  ISearchParams,
  TResponseSearchRecords,
} from '@jingo/utils'

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

  async search(
    params: ISearchParams,
  ): Promise<TResponseSearchRecords<Subject>> {
    const { conditions, pager, sorter } = new MongoSearchConditions(params, {
      sortBy: params.sortBy || 'sort',
      keywords: ['name', 'alias'],
    })

    const query = await this.subjectModel
      .find(conditions)
      .skip(pager.skipCount)
      .limit(pager.pageSize)
      .sort(sorter)

    const total = await this.getAllCount()
    const totalPage = Math.ceil(
      total / (pager.pageSize === 0 ? 1 : pager.pageSize),
    )

    return {
      page: pager.page,
      pageSize: pager.pageSize,
      total,
      totalPage,
      records: query,
    }
  }

  async findAll(): Promise<Subject[]> {
    return await this.subjectModel.find().lean()
  }

  async findOneById(id: string): Promise<Subject> {
    return await this.subjectModel.findById(id).lean()
  }

  async findOneByName(name: string): Promise<Subject> {
    return await this.subjectModel.findOne({ name }).lean()
  }

  async create(createDto: CreateSubjectDto): Promise<Subject> {
    return await this.subjectModel.create(createDto)
  }

  async update(id: string, updateDto: UpdateSubjectDto): Promise<Subject> {
    const updateTime = new Date()
    return await this.subjectModel
      .findByIdAndUpdate(
        id,
        {
          ...updateDto,
          updateTime,
        },
        { new: true },
      )
      .lean()
  }

  async deleteById(id: string) {
    return await this.subjectModel.findByIdAndDelete(id)
  }

  async batchDeleteByIds(ids: string[]): Promise<any> {
    return await this.subjectModel.deleteMany({ _id: { $in: ids } })
  }
}
