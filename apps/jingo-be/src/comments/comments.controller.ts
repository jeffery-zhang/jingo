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

import { CommentsService } from './comments.service'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { CreateCommentsDto } from './dtos/create-comment.dto'
import { UpdateCommentsDto } from './dtos/update-comment.dto'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { UserChecker } from './guards/user-checker.guard'
import { Roles } from '../roles/role.decorator'
import { Role } from '../roles/role.enum'
import { RolesGuard } from '../roles/role.guard'
import { ICommentsSearchParams } from './interfaces/comment.interface'

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async search(@Query() params: ICommentsSearchParams) {
    return await this.commentsService.search(params)
  }

  @Get('comment/:id')
  async viewOneById(@Param('id', ObjectIdPipe) id: string) {
    return await this.commentsService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('like/:id')
  async likeOneByid(@Param('id', ObjectIdPipe) id: string, @Request() req) {
    return await this.commentsService.increaseLikes(id, req.user._id)
  }

  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string) {
    return await this.commentsService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(@Request() req, @Body() createCommentDto: CreateCommentsDto) {
    await this.commentsService.create(req.user._id, createCommentDto)
    return { message: '评论成功' }
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Put('save')
  async update(
    @Body('id', ObjectIdPipe) id,
    @Body() updateCommentDto: UpdateCommentsDto,
  ) {
    console.log('更新评论id: ', id)
    await this.commentsService.update(id, updateCommentDto)
    return { message: '更新评论成功' }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('batchDelete')
  async batchDeleteByIds(@Body('ids') ids: string[]) {
    await this.commentsService.batchDeleteByIds(ids)
    return { message: '批量删除评论成功' }
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Delete(':id')
  async deleteById(@Param('id', ObjectIdPipe) id: string) {
    await this.commentsService.deleteById(id)
    return { message: '删除评论成功' }
  }
}
