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

import { CommentsService } from './comments.service'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { CreateCommentDto } from './dtos/create-comment.dto'
import { UpdateCommentDto } from './dtos/update-comment.dto'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { UserChecker } from './guards/user-checker.guard'
import { Roles } from '../roles/role.decorator'
import { Role } from '../roles/role.enum'
import { RolesGuard } from '../roles/role.guard'
import { OperationEntity } from '../shared/entities/operation.entity'
import {
  ICommentLikes,
  ICommentsSearchParams,
} from './interfaces/comment.interface'
import { Comment } from './schemas/comment.schema'

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async search(
    @Query() params: ICommentsSearchParams,
  ): Promise<TResponseSearchRecords<Comment>> {
    return await this.commentsService.search(params)
  }

  @UseGuards(JwtAuthGuard)
  @Get('like/:id')
  async likeOneById(
    @Param('id', ObjectIdPipe) id: string,
    @Request() req,
  ): Promise<ICommentLikes> {
    return await this.commentsService.increaseLikes(id, req.user._id)
  }

  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string): Promise<Comment> {
    return await this.commentsService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<OperationEntity> {
    await this.commentsService.create(req.user._id, createCommentDto)
    return new OperationEntity('评论成功')
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Put('save')
  async update(
    @Body('id', ObjectIdPipe) id,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<OperationEntity> {
    await this.commentsService.update(id, updateCommentDto)
    return new OperationEntity('更新评论成功')
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('batchDelete')
  async batchDeleteByIds(@Body('ids') ids: string[]): Promise<OperationEntity> {
    await this.commentsService.batchDeleteByIds(ids)
    return new OperationEntity('批量删除评论成功')
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Delete(':id')
  async deleteById(
    @Param('id', ObjectIdPipe) id: string,
  ): Promise<OperationEntity> {
    await this.commentsService.deleteById(id)
    return new OperationEntity('删除评论成功')
  }
}
