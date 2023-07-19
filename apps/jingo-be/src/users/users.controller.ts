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
} from '@nestjs/common'

import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { RolesGuard } from '../roles/role.guard'
import { Roles } from '../roles/role.decorator'
import { Role } from '../roles/role.enum'
import { UpdateDto } from './dtos/update.dto'
import { UserEntity } from './entities/user.entity'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async findAll() {
    const users = await this.userService.findAll()
    return users.map((user) => new UserEntity(user))
  }

  @Get('count')
  async getAllCount() {
    return await this.userService.getAllCount()
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string) {
    const user = await this.userService.findOneById(id)
    return new UserEntity(user)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateUser(@Request() req, @Body() updateDto: UpdateDto) {
    const id = req.user._id
    const user = await this.userService.update(id, updateDto)
    return new UserEntity(user)
  }
}
