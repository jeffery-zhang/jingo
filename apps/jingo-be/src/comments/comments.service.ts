import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { Model } from 'mongoose'
import { MongoSearchConditions, TResponseSearchRecords } from '@jingo/utils'

import { Comment } from './schemas/comment.schema'
import { CreateCommentDto } from './dtos/create-comment.dto'
import { UpdateCommentDto } from './dtos/update-comment.dto'
import { PostsService } from '../posts/posts.service'
import { User } from '../users/schemas/user.schema'
import { UsersService } from '../users/users.service'
import {
  ICommentsSearchParams,
  ICommentLikes,
} from './interfaces/comment.interface'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  private likeKey = 'comment_like_'

  private async getAuthor(id: string): Promise<User> {
    try {
      return await this.usersService.findOneById(id)
    } catch (err) {
      throw new BadRequestException('未找到用户')
    }
  }

  private async validdatePost(id: string): Promise<boolean> {
    try {
      await this.postsService.findOneById(id)
      return true
    } catch (err) {
      throw new BadRequestException('未找到文章')
    }
  }

  private async getLikes(id: string): Promise<string[]> {
    const key = this.likeKey + id
    return await this.cacheManager.wrap(
      key,
      async () => (await this.findOneById(id)).likes,
    )
  }

  async getAllCount(): Promise<number> {
    return await this.commentModel.estimatedDocumentCount()
  }

  async search(
    params: ICommentsSearchParams,
  ): Promise<TResponseSearchRecords<Comment>> {
    const { conditions, pager, sorter } = new MongoSearchConditions(params, {
      sortBy: params.sortBy || 'createTime',
      keywords: ['content'],
    })

    const query = await this.commentModel
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

  async findOneById(id: string): Promise<Comment> {
    return this.commentModel.findById(id).lean()
  }

  async create(
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    await this.validdatePost(createCommentDto.postId)
    const author = await this.getAuthor(userId)

    return (
      await this.commentModel.create({
        ...createCommentDto,
        author,
      })
    ).toObject()
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    if (!updateCommentDto.content) {
      throw new BadRequestException('更新内容不能为空')
    }
    const updateTime = new Date()
    const dto: any = {
      content: updateCommentDto.content,
      updateTime,
    }
    return await this.commentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean()
  }

  async deleteById(id: string): Promise<Comment> {
    return await this.commentModel.findByIdAndDelete(id)
  }

  async batchDeleteByIds(ids: string[]): Promise<any> {
    return await this.commentModel.deleteMany({ _id: { $in: ids } })
  }

  async increaseLikes(id: string, userId: string): Promise<ICommentLikes> {
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

  async getLikesFromCache(): Promise<{ [key: string]: string[] }> {
    const keys = await this.cacheManager.store.keys()
    const likeKey = this.likeKey
    const likes = {}
    for (const key of keys) {
      if (key.startsWith(likeKey)) {
        const id = key.split('_')[2]
        likes[id] = await this.cacheManager.get<string[]>(key)
      }
    }

    return likes
  }

  async updateCacheToDb() {
    const likes = await this.getLikesFromCache()
    const ids = [...new Set([...Object.keys(likes)])].map((i) => i)
    if (ids.length === 0) return
    const bulkWrites = ids.map((id) => ({
      updateOne: {
        filter: { _id: id },
        update: {
          likes: likes[id],
        },
      },
    }))
    await this.commentModel.bulkWrite(bulkWrites)
  }

  @Cron('0 10,40 * * * *')
  async handleCron() {
    await this.updateCacheToDb()
  }
}
