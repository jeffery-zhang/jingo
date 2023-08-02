import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  Body,
  Param,
} from '@nestjs/common'
import { TResponseSearchRecords } from '@jingo/utils'

import { RepliesService } from './replies.service'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { CreateReplyDto } from './dtos/create-reply.dto'
import { UpdateReplyDto } from './dtos/update-reply.dto'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { UserChecker } from './guards/user-checker.guard'
import { Roles } from '../roles/role.decorator'
import { Role } from '../roles/role.enum'
import { RolesGuard } from '../roles/role.guard'
import { OperationEntity } from '../shared/entities/operation.entity'
import { IRepliesSearchParams, IReplyLikes } from './interfaces/reply.interface'
import { Reply } from './schemas/reply.schema'

@Controller('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Get()
  async search(
    @Query() params: IRepliesSearchParams,
  ): Promise<TResponseSearchRecords<Reply>> {
    return await this.repliesService.search(params)
  }

  @UseGuards(JwtAuthGuard)
  @Get('like/:id')
  async likeOneById(
    @Param('id', ObjectIdPipe) id: string,
    @Request() req,
  ): Promise<IReplyLikes> {
    return await this.repliesService.increaseLikes(id, req.user._id)
  }

  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string): Promise<Reply> {
    return await this.repliesService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(
    @Request() req,
    @Body() createReplyDto: CreateReplyDto,
  ): Promise<OperationEntity> {
    await this.repliesService.create(req.user._id, createReplyDto)
    return new OperationEntity('回复成功')
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Put('save')
  async update(
    @Body('id', ObjectIdPipe) id,
    @Body() updateReplyDto: UpdateReplyDto,
  ): Promise<OperationEntity> {
    await this.repliesService.update(id, updateReplyDto)
    return new OperationEntity('更新回复成功')
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('batchDelete')
  async batchDeleteByIds(@Body('ids') ids: string[]): Promise<OperationEntity> {
    await this.repliesService.batchDeleteByIds(ids)
    return new OperationEntity('批量删除回复成功')
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Delete(':id')
  async deleteById(
    @Param('id', ObjectIdPipe) id: string,
  ): Promise<OperationEntity> {
    await this.repliesService.deleteById(id)
    return new OperationEntity('删除回复成功')
  }
}
