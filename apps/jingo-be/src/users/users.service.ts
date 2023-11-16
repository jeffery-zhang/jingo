import { Injectable, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoSearchConditions, TResponseSearchRecords } from '@jingo/utils'

import { User } from './schemas/user.schema'
import { RegisterDto } from '../auth/dtos/register.dto'
import { UpdateDto } from './dtos/update.dto'
import { IUsersSearchParams } from './interfaces/user.interface'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllCount(): Promise<number> {
    return await this.userModel.estimatedDocumentCount()
  }

  async search(
    params: IUsersSearchParams,
  ): Promise<TResponseSearchRecords<User>> {
    const { conditions, pager, sorter } = new MongoSearchConditions(params, {
      sortBy: params.sortBy || 'createTime',
      keywords: ['username', 'mail'],
    })

    const query = await this.userModel
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

  async findAll(): Promise<User[]> {
    return await this.userModel.find().lean()
  }

  async findOneById(id: string): Promise<User> {
    return await this.userModel.findById(id).lean()
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username }).lean()
  }

  async findOneByMail(mail: string): Promise<User> {
    return await this.userModel.findOne({ mail }).lean()
  }

  async create(registerDto: RegisterDto): Promise<User> {
    return (await this.userModel.create(registerDto)).toObject()
  }

  async update(id: string, updateDto: UpdateDto): Promise<User> {
    const valid = await this.validateUsernameAndMail(
      updateDto.username,
      updateDto.mail,
    )
    if (!valid) return
    const updateTime = new Date()
    return await this.userModel
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
    return await this.userModel.findByIdAndDelete(id)
  }

  public async validateUsernameAndMail(
    username: string,
    mail: string,
  ): Promise<boolean> {
    if (username) {
      const user = await this.findOneByUsername(username)
      if (user) {
        throw new ForbiddenException('用户名已存在')
      }
    }

    if (mail) {
      const user = await this.findOneByMail(mail)
      if (user) {
        throw new ForbiddenException('该邮箱已被注册')
      }
    }

    return true
  }
}
