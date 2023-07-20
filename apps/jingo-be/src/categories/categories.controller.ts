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
import { TResponseSearchRecords } from '@jingo/utils'

import { CategoriesService } from './categories.service'
import { Category } from './schemas/category.schema'
import { CreateCategoryDto } from './dtos/create-category.dto'
import { UpdateCategoryDto } from './dtos/update-category.dto'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { OperationEntity } from '../shared/entities/operation.entity'
import { ICategoriesSearchParams } from './interfaces/category.inteface'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async search(
    @Query() params: ICategoriesSearchParams,
  ): Promise<TResponseSearchRecords<Category>> {
    return await this.categoriesService.search(params)
  }

  @Get('all')
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll()
  }

  @Get('count')
  async getAllCount(): Promise<number> {
    return await this.categoriesService.getAllCount()
  }

  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string): Promise<Category> {
    return await this.categoriesService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(@Body() createDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.create(createDto)
  }

  @UseGuards(JwtAuthGuard)
  @Put('save')
  async update(
    @Body('id', ObjectIdPipe) id: string,
    @Body() updateDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.update(id, updateDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('batchDelete')
  async batchDelete(@Body('ids') ids: string[]): Promise<OperationEntity> {
    await this.categoriesService.batchDeleteByIds(ids)
    return new OperationEntity('批量删除分类成功')
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id', ObjectIdPipe) id: string,
  ): Promise<OperationEntity> {
    await this.categoriesService.deleteById(id)
    return new OperationEntity('删除分类成功')
  }
}
