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

import { SubjectsService } from './subjects.service'
import { Subject } from './schemas/subject.schema'
import { CreateSubjectDto } from './dtos/create-subject.dto'
import { UpdateSubjectDto } from './dtos/update-subject.dto'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'

@Controller('users')
export class UsersController {
  constructor(private readonly subjectService: SubjectsService) {}

  @Get()
  async findAll() {
    return await this.subjectService.findAll()
  }

  @Get('count')
  async getAllCount() {
    return await this.subjectService.getAllCount()
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string) {
    const user = await this.subjectService.findOneById(id)
    return new UserEntity(user)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateUser(@Request() req, @Body() updateDto: UpdateDto) {
    const id = req.user._id
    const user = await this.subjectService.update(id, updateDto)
    console.log('lets see updated user: ', user)
    return new UserEntity(user)
  }
}
