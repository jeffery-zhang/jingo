import { Injectable, BadRequestException, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { Model } from 'mongoose'
import { MongoSearchConditions, TResponseSearchRecords } from '@jingo/utils'

import { Post } from './schemas/post.schema'
import {
  IPostsSearchParams,
  IPostLikes,
  IPostPv,
} from './interfaces/post.interface'
import { CreatePostDto } from './dtos/create-post.dto'
import { UpdatePostDto } from './dtos/update-post.dto'
import { SubjectsService } from '../subjects/subjects.service'
import { CategoriesService } from '../categories/categories.service'
import { Subject } from '../subjects/schemas/subject.schema'
import { User } from '../users/schemas/user.schema'
import { Category } from '../categories/schemas/category.schema'
import { UsersService } from '../users/users.service'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly usersService: UsersService,
    private readonly subjectsService: SubjectsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private pvKey = 'post_pv_'

  private likeKey = 'post_like_'

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

  private async getPv(id: string): Promise<number> {
    const key = this.pvKey + id
    return await this.cacheManager.wrap(
      key,
      async () => (await this.findOneById(id)).pv,
    )
  }

  private async getLikes(id: string): Promise<string[]> {
    const key = this.likeKey + id
    return await this.cacheManager.wrap(
      key,
      async () => (await this.findOneById(id)).likes,
    )
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

    return (
      await this.postModel.create({
        ...createPostDto,
        author,
        subject,
        category,
      })
    ).toObject()
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

  async deleteById(id: string): Promise<Post> {
    return await this.postModel.findByIdAndDelete(id)
  }

  async batchDeleteByIds(ids: string[]): Promise<any> {
    return await this.postModel.deleteMany({ _id: { $in: ids } })
  }

  async increasePv(id: string): Promise<IPostPv> {
    const pv = await this.getPv(id)
    const key = this.pvKey + id
    await this.cacheManager.set(key, pv + 1)
    const result = await this.cacheManager.get<number>(key)
    return {
      _id: id,
      pv: result,
    }
  }

  async increaseLikes(id: string, userId: string): Promise<IPostLikes> {
    const likes = await this.getLikes(id)
    const key = this.likeKey + id
    if (likes.includes(userId)) throw new BadRequestException('不能重复点赞')
    likes.push(userId)
    await this.cacheManager.set(key, likes)
    return {
      _id: id,
      likes,
    }
  }

  async getAllPvsAndLikesFromCache(): Promise<{
    pvs: { [key: string]: number }
    likes: { [key: string]: string[] }
  }> {
    const keys = await this.cacheManager.store.keys()
    const pvKey = this.pvKey
    const likeKey = this.likeKey
    const pvs = {}
    const likes = {}
    for (const key of keys) {
      if (key.startsWith(pvKey)) {
        const id = key.split('_')[2]
        pvs[id] = await this.cacheManager.get<number>(key)
      }
      if (key.startsWith(likeKey)) {
        const id = key.split('_')[2]
        likes[id] = await this.cacheManager.get<string[]>(key)
      }
    }

    return {
      pvs,
      likes,
    }
  }

  async updateCacheToDb() {
    const { pvs, likes } = await this.getAllPvsAndLikesFromCache()
    const ids = [...new Set([...Object.keys(pvs), ...Object.keys(likes)])].map(
      (i) => i,
    )
    if (ids.length === 0) return
    const bulkWrites = ids.map((id) => ({
      updateOne: {
        filter: { _id: id },
        update: {
          pv: pvs[id],
          likes: likes[id],
        },
      },
    }))
    await this.postModel.bulkWrite(bulkWrites)
  }

  @Cron('0 0,30 * * * *')
  async handleCron() {
    await this.updateCacheToDb()
  }
}
