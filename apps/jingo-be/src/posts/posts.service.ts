import { Injectable, BadRequestException, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { Model } from 'mongoose'
import { MongoSearchConditions, TResponseSearchRecords } from '@jingo/utils'

import { Post } from './schemas/post.schema'
import { IPostsSearchParams } from './interfaces/post.interface'
import { CreatePostDto } from './dtos/create-post.dto'
import { UpdatePostDto } from './dtos/update-post.dto'
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
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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

  private async getPv(postId: string): Promise<number> {
    const postPvId = `post_${postId}_pv`
    let pv: number = await this.cacheManager.get(postPvId)
    if (!pv) {
      pv = (await this.findOneById(postId)).pv
      await this.cacheManager.set(postPvId, pv)
    }
    return pv
  }

  private async getLikes(postId: string): Promise<string[]> {
    const postLikesId = `post_${postId}_likes`
    let likes: string[] = await this.cacheManager.get(postLikesId)
    if (!likes) {
      likes = (await this.findOneById(postId)).likes
      await this.cacheManager.set(postLikesId, likes)
    }
    return likes
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
      .select('-content')

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
    return await this.postModel.find().select('-content').lean()
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

  async increasePv(id: string): Promise<{ _id: string; pv: number }> {
    const pv = await this.getPv(id)
    await this.cacheManager.set(`post_${id}_pv`, pv + 1)
    return {
      _id: id,
      pv: pv + 1,
    }
  }

  async increaseLikes(
    id: string,
    userId: string,
  ): Promise<{ _id: string; likes: string[] }> {
    const likes = await this.getLikes(id)
    likes.push(userId)
    await this.cacheManager.set(`post_${id}_likes`, likes)
    return {
      _id: id,
      likes,
    }
  }
}
