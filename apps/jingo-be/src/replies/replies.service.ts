import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { Model } from 'mongoose'
import { MongoSearchConditions, TResponseSearchRecords } from '@jingo/utils'

import { Reply } from './schemas/reply.schema'
import { Comment } from '../comments/schemas/comment.schema'
import { CreateReplyDto } from './dtos/create-reply.dto'
import { UpdateReplyDto } from './dtos/update-reply.dto'
import { CommentsService } from '../comments/comments.service'
import { User } from '../users/schemas/user.schema'
import { UsersService } from '../users/users.service'
import { IRepliesSearchParams, IReplyLikes } from './interfaces/reply.interface'
import { Cron } from '@nestjs/schedule'
import { ReplyType } from './entities/reply-type.entity'

@Injectable()
export class RepliesService {
  constructor(
    @InjectModel(Reply.name) private readonly replyModel: Model<Reply>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
  ) {}

  private likeKey = 'reply_like_'

  private async getAuthor(id: string): Promise<User> {
    try {
      return await this.usersService.findOneById(id)
    } catch (err) {
      throw new BadRequestException('未找到用户')
    }
  }

  private async getReplyTo(
    id: string,
    type: ReplyType,
  ): Promise<Comment | Reply> {
    let result: Comment | Reply | null = null
    if (type === 'reply') {
      result = await this.findOneById(id)
    }
    if (type === 'comment') {
      result = await this.commentsService.findOneById(id)
    }
    if (!result) {
      throw new BadRequestException('未找到回复对象')
    }
    return result
  }

  private async getLikes(id: string): Promise<string[]> {
    const key = this.likeKey + id
    return await this.cacheManager.wrap(
      key,
      async () => (await this.findOneById(id)).likes,
    )
  }

  async getAllCount(): Promise<number> {
    return await this.replyModel.estimatedDocumentCount()
  }

  async search(
    params: IRepliesSearchParams,
  ): Promise<TResponseSearchRecords<Reply>> {
    const { conditions, pager, sorter } = new MongoSearchConditions(params, {
      sortBy: params.sortBy || 'createTime',
      keywords: ['content'],
    })

    const query = await this.replyModel
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

  async findOneById(id: string): Promise<Reply> {
    return this.replyModel.findById(id).lean()
  }

  async create(userId: string, createReplyDto: CreateReplyDto): Promise<Reply> {
    const replyTo = await this.getReplyTo(
      createReplyDto.fatherId,
      createReplyDto.replyType,
    )
    const author = await this.getAuthor(userId)

    return (
      await this.replyModel.create({
        ...createReplyDto,
        author,
        replyTo: {
          _id: replyTo._id,
          type: createReplyDto.replyType,
          content: replyTo.content,
        },
      })
    ).toObject()
  }

  async update(id: string, updateReplyDto: UpdateReplyDto): Promise<Reply> {
    if (!updateReplyDto.content) {
      throw new BadRequestException('更新内容不能为空')
    }
    const updateTime = new Date()
    const dto: any = {
      content: updateReplyDto.content,
      updateTime,
    }
    return await this.replyModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean()
  }

  async deleteById(id: string): Promise<Reply> {
    return await this.replyModel.findByIdAndDelete(id)
  }

  async batchDeleteByIds(ids: string[]): Promise<any> {
    return await this.replyModel.deleteMany({ _id: { $in: ids } })
  }

  async increaseLikes(id: string, userId: string): Promise<IReplyLikes> {
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
    await this.replyModel.bulkWrite(bulkWrites)
  }

  @Cron('0 20,50 * * * *')
  async handleCron() {
    await this.updateCacheToDb()
  }
}
