import { Injectable, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User } from './schemas/user.schema'
import { RegisterDto } from '../auth/dtos/register.dto'
import { UpdateDto } from './dtos/update.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async getAllCount(): Promise<number> {
    return await this.userModel.estimatedDocumentCount()
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
    return await this.userModel.create(registerDto)
  }

  async update(id: string, updateDto: UpdateDto): Promise<User> {
    const valid = this.validateUsernameAndMail(
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

  public async validateUsernameAndMail(
    username: string,
    mail: string,
  ): Promise<boolean> {
    const user = await this.findOneByUsername(username)
    if (user) {
      throw new ForbiddenException('用户名已存在')
    }
    const anotherUser = await this.findOneByMail(mail)
    if (anotherUser) {
      throw new ForbiddenException('该邮箱已被注册')
    }
    return true
  }
}
