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

import { PostsService } from './posts.service'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import { IPostsSearchParams } from './interfaces/post.interface'
import { CreatePostDto } from './dtos/create-post.dto'
import { UpdatePostDto } from './dtos/update-post.dto'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { UserChecker } from './guards/user-checker.guard'
import { Roles } from '../roles/role.decorator'
import { Role } from '../roles/role.enum'
import { RolesGuard } from '../roles/role.guard'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async search(@Query() params: IPostsSearchParams) {
    return await this.postsService.search(params)
  }

  @Get('realView/:id')
  async viewOneById(@Param('id', ObjectIdPipe) id: string) {
    this.postsService.increasePv(id)
    return await this.postsService.findOneById(id)
  }

  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string) {
    return await this.postsService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(@Request() req, @Body() createPostDto: CreatePostDto) {
    await this.postsService.create(req.user._id, createPostDto)
    return { message: '新建文章成功' }
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Put('save')
  async update(
    @Body('id', ObjectIdPipe) id,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    await this.postsService.update(id, updatePostDto)
    return { message: '更新文章成功' }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('batchDelete')
  async batchDeleteByIds(@Body('ids') ids: string[]) {
    await this.postsService.batchDeleteByIds(ids)
    return { message: '批量删除文章成功' }
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Delete(':id')
  async deleteById(@Param('id', ObjectIdPipe) id: string) {
    await this.postsService.deleteById(id)
    return { message: '删除文章成功' }
  }
}
