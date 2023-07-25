import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { Model } from 'mongoose'
import { MongoSearchConditions, TResponseSearchRecords } from '@jingo/utils'

import { Comment } from './schemas/comment.schema'
import { CreateCommentsDto } from './dtos/create-comment.dto'
import { UpdateCommentsDto } from './dtos/update-comment.dto'
import { PostsService } from '../posts/posts.service'
import { User } from '../users/schemas/user.schema'
import { UsersService } from '../users/users.service'
import { ICommentsSearchParams } from './interfaces/comment.interface'

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

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

  private async getLikes(postId: string): Promise<string[]> {
    const postLikesId = `comment_${postId}_likes`
    let likes: string[] = await this.cacheManager.get(postLikesId)
    if (!likes) {
      likes = (await this.findOneById(postId)).likes
      await this.cacheManager.set(postLikesId, likes)
    }
    return likes
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

  async findOneByTitle(title: string): Promise<Comment> {
    return this.commentModel.findOne({ title }).lean()
  }

  async create(
    userId: string,
    createCommentDto: CreateCommentsDto,
  ): Promise<Comment> {
    await this.validdatePost(createCommentDto.postId)
    const author = await this.getAuthor(userId)

    return await this.commentModel.create({
      ...createCommentDto,
      author,
    })
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentsDto,
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

  async deleteById(id: string) {
    return await this.commentModel.findByIdAndDelete(id)
  }

  async batchDeleteByIds(ids: string[]): Promise<any> {
    return await this.commentModel.deleteMany({ _id: { $in: ids } })
  }

  async increaseLikes(
    id: string,
    userId: string,
  ): Promise<{ _id: string; likes: string[] }> {
    const likes = await this.getLikes(id)
    likes.push(userId)
    await this.cacheManager.set(`comment_${id}_likes`, likes)
    return {
      _id: id,
      likes,
    }
  }
}
