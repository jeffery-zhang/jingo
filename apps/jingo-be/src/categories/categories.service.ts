import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoSearchConditions, TResponseSearchRecords } from '@jingo/utils'

import { Category } from './schemas/category.schema'
import { CreateCategoryDto } from './dtos/create-category.dto'
import { UpdateCategoryDto } from './dtos/update-category.dto'
import { ICategoriesSearchParams } from './interfaces/category.inteface'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoriesModel: Model<Category>,
  ) {}

  async getAllCount(): Promise<number> {
    return await this.categoriesModel.estimatedDocumentCount()
  }

  async search(
    params: ICategoriesSearchParams,
  ): Promise<TResponseSearchRecords<Category>> {
    const { conditions, pager, sorter } = new MongoSearchConditions(params, {
      sortBy: params.sortBy || 'sort',
      keywords: ['name', 'alias'],
    })

    const query = await this.categoriesModel
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

  async findAll(): Promise<Category[]> {
    return await this.categoriesModel.find().lean()
  }

  async findOneById(id: string): Promise<Category> {
    return await this.categoriesModel.findById(id).lean()
  }

  async findOneByName(name: string): Promise<Category> {
    return await this.categoriesModel.findOne({ name }).lean()
  }

  async create(createDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesModel.create(createDto)
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
    const updateTime = new Date()
    return await this.categoriesModel
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
    return await this.categoriesModel.findByIdAndDelete(id)
  }

  async batchDeleteByIds(ids: string[]): Promise<any> {
    return await this.categoriesModel.deleteMany({ _id: { $in: ids } })
  }
}
