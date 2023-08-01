import {
  Controller,
  Get,
  Request,
  Body,
  UseGuards,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Query,
  Delete,
} from '@nestjs/common'
import { TResponseSearchRecords } from '@jingo/utils'

import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { RolesGuard } from '../roles/role.guard'
import { Roles } from '../roles/role.decorator'
import { Role } from '../roles/role.enum'
import { UpdateDto } from './dtos/update.dto'
import { UserEntity } from './entities/user.entity'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { IUsersSearchParams } from './interfaces/user.interface'
import { OperationEntity } from '../shared/entities/operation.entity'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async search(
    @Query() params: IUsersSearchParams,
  ): Promise<TResponseSearchRecords<UserEntity>> {
    const result = await this.userService.search(params)
    const records = result.records.map((user) => new UserEntity(user))
    return {
      ...result,
      records,
    }
  }

  @Get('count')
  async getAllCount(): Promise<number> {
    return await this.userService.getAllCount()
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneById(
    @Param('id', ObjectIdPipe) id: string,
  ): Promise<UserEntity> {
    const user = await this.userService.findOneById(id)
    return new UserEntity(user)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateUser(
    @Request() req,
    @Body() updateDto: UpdateDto,
  ): Promise<UserEntity> {
    const id = req.user._id
    const user = await this.userService.update(id, updateDto)
    return new UserEntity(user)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async deleteById(
    @Param('id', ObjectIdPipe) id: string,
  ): Promise<OperationEntity> {
    await this.userService.deleteById(id)
    return new OperationEntity('删除用户成功')
  }
}
