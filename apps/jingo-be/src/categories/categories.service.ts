import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoSearchConditions, TResponseSearchRecords } from '@jingo/utils'

import { Category } from './schemas/category.schema'
import { CreateCategoryDto } from './dtos/create-category.dto'
import { UpdateCategoryDto } from './dtos/update-category.dto'
import { ICategoriesSearchParams } from './interfaces/category.inteface'
import { SubjectsService } from '../subjects/subjects.service'
import { Subject } from '../subjects/schemas/subject.schema'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private subjectsService: SubjectsService,
  ) {}

  private async getParent(id: string): Promise<Subject> {
    try {
      return await this.subjectsService.findOneById(id)
    } catch (err) {
      throw new BadRequestException('未找到对应主题')
    }
  }

  async getAllCount(): Promise<number> {
    return await this.categoryModel.estimatedDocumentCount()
  }

  async search(
    params: ICategoriesSearchParams,
  ): Promise<TResponseSearchRecords<Category>> {
    const { conditions, pager, sorter } = new MongoSearchConditions(params, {
      sortBy: params.sortBy || 'sort',
      keywords: ['name', 'alias'],
    })

    const query = await this.categoryModel
      .find(conditions)
      .skip(pager.skipCount)
      .limit(pager.pageSize)
      .sort(sorter)
      .lean()

    const total = query.length
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

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find().lean()
  }

  async findOneById(id: string): Promise<Category> {
    return await this.categoryModel.findById(id).lean()
  }

  async findOneByName(name: string): Promise<Category> {
    return await this.categoryModel.findOne({ name }).lean()
  }

  async create(createDto: CreateCategoryDto): Promise<Category> {
    const parent = await this.getParent(createDto.parentId)
    return (
      await this.categoryModel.create({
        ...createDto,
        parent,
      })
    ).toObject()
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
    const updateTime = new Date()
    const dto: any = {
      ...updateDto,
      updateTime,
    }
    if (updateDto.parentId) {
      const parent = await this.getParent(updateDto.parentId)
      dto.parent = parent
    }
    return await this.categoryModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean()
  }

  async deleteById(id: string): Promise<Category> {
    return await this.categoryModel.findByIdAndDelete(id)
  }

  async batchDeleteByIds(ids: string[]): Promise<any> {
    return await this.categoryModel.deleteMany({ _id: { $in: ids } })
  }
}
