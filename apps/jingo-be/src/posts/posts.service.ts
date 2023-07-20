import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Post } from './schemas/post.schema'
import { IPostsSearchParams } from './interfaces/post.interface'
import { CreatePostDto } from './dtos/create-post.dto'
import { UpdatePostDto } from './dtos/update-post.dto'
import { MongoSearchConditions, TResponseSearchRecords } from '@jingo/utils'
import { SubjectsService } from '../subjects/subjects.service'
import { CategoriesService } from '../categories/categories.service'
import { Subject } from '../subjects/schemas/subject.schema'
import { User } from '../users/schemas/user.schema'
import { Category } from '../categories/schemas/category.schema'
import { UsersService } from '../users/users.service'

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    private readonly usersService: UsersService,
    private readonly subjectsService: SubjectsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private async getAuthor(id: string): Promise<User> {
    try {
      return await this.usersService.findOneById(id)
    } catch (err) {
      throw new BadRequestException('未找到用户')
    }
  }

  private async getSubject(id: string): Promise<Subject> {
    try {
      return await this.subjectsService.findOneById(id)
    } catch (err) {
      throw new BadRequestException('未找到对应主题')
    }
  }

  private async getCategory(id: string): Promise<Category> {
    try {
      return await this.categoriesService.findOneById(id)
    } catch (err) {
      throw new BadRequestException('未找到对应分类')
    }
  }

  async getAllCount(): Promise<number> {
    return await this.postModel.estimatedDocumentCount()
  }

  async search(
    params: IPostsSearchParams,
  ): Promise<TResponseSearchRecords<Post>> {
    const { conditions, pager, sorter } = new MongoSearchConditions(params, {
      sortBy: params.sortBy || 'createTime',
      keywords: ['title', 'summary'],
    })

    const query = await this.postModel
      .find(conditions)
      .skip(pager.skipCount)
      .limit(pager.pageSize)
      .sort(sorter)

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

  async findAll(): Promise<Post[]> {
    return await this.postModel.find().lean()
  }

  async findOneById(id: string): Promise<Post> {
    return this.postModel.findById(id).lean()
  }

  async findOneByTitle(title: string): Promise<Post> {
    return this.postModel.findOne({ title }).lean()
  }

  async create(userId: string, createPostDto: CreatePostDto): Promise<Post> {
    const author = await this.getAuthor(userId)
    const category = await this.getCategory(createPostDto.categoryId)
    const subject = await this.getSubject(category.parent._id)

    return await this.postModel.create({
      ...createPostDto,
      author,
      subject,
      category,
    })
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updateTime = new Date()
    const dto: any = {
      ...updatePostDto,
      updateTime,
    }
    if (updatePostDto.categoryId) {
      const category = await this.getCategory(updatePostDto.categoryId)
      const subject = await this.getSubject(category.parent._id)
      dto.category = category
      dto.subject = subject
    }
    return await this.postModel.findByIdAndUpdate(id, dto, { new: true }).lean()
  }

  async deleteById(id: string) {
    return await this.postModel.findByIdAndDelete(id)
  }

  async batchDeleteByIds(ids: string[]): Promise<any> {
    return await this.postModel.deleteMany({ _id: { $in: ids } })
  }

  async increasePv(id: string): Promise<Omit<Post, '_id' | 'pv'>> {
    return await this.postModel
      .findOneAndUpdate({ _id: id }, { $inc: { pv: 1 } }, { new: true })
      .select('pv')
  }
}
