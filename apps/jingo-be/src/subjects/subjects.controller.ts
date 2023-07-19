import {
  Controller,
  Get,
  Body,
  UseGuards,
  Put,
  Param,
  Query,
  Post,
  Delete,
} from '@nestjs/common'
import { ISearchParams, TResponseSearchRecords } from '@jingo/utils'

import { SubjectsService } from './subjects.service'
import { Subject } from './schemas/subject.schema'
import { CreateSubjectDto } from './dtos/create-subject.dto'
import { UpdateSubjectDto } from './dtos/update-subject.dto'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { OperationEntity } from '../shared/entities/operation.entity'

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async search(
    @Query() params: ISearchParams,
  ): Promise<TResponseSearchRecords<Subject>> {
    return await this.subjectsService.search(params)
  }

  @Get('all')
  async findAll(): Promise<Subject[]> {
    return await this.subjectsService.findAll()
  }

  @Get('count')
  async getAllCount(): Promise<number> {
    return await this.subjectsService.getAllCount()
  }

  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string): Promise<Subject> {
    return await this.subjectsService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(@Body() createDto: CreateSubjectDto): Promise<Subject> {
    return await this.subjectsService.create(createDto)
  }

  @UseGuards(JwtAuthGuard)
  @Put('save')
  async update(
    @Body('id', ObjectIdPipe) id: string,
    @Body() updateDto: UpdateSubjectDto,
  ): Promise<Subject> {
    return await this.subjectsService.update(id, updateDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(
    @Param('id', ObjectIdPipe) id: string,
  ): Promise<OperationEntity> {
    await this.subjectsService.deleteById(id)
    return new OperationEntity('删除主题成功')
  }

  @UseGuards(JwtAuthGuard)
  @Delete('batchDelete')
  async batchDelete(@Body('ids') ids: string[]): Promise<OperationEntity> {
    await this.subjectsService.batchDeleteByIds(ids)
    return new OperationEntity('批量删除主题成功')
  }
}
