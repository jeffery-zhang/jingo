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

import { PostsService } from './posts.service'
import { ObjectIdPipe } from '../shared/pipes/object-id.pipe'
import {
  IPostsSearchParams,
  IPostLikes,
  IPostPv,
} from './interfaces/post.interface'
import { CreatePostDto } from './dtos/create-post.dto'
import { UpdatePostDto } from './dtos/update-post.dto'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { UserChecker } from './guards/user-checker.guard'
import { Roles } from '../roles/role.decorator'
import { Role } from '../roles/role.enum'
import { RolesGuard } from '../roles/role.guard'
import { OperationEntity } from '../shared/entities/operation.entity'
import { Post as PostType } from './schemas/post.schema'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async search(
    @Query() params: IPostsSearchParams,
  ): Promise<TResponseSearchRecords<PostType>> {
    return await this.postsService.search(params)
  }

  @Get('post/:id')
  async viewOneById(@Param('id', ObjectIdPipe) id: string): Promise<PostType> {
    const { pv } = await this.postsService.increasePv(id)
    const post = await this.postsService.findOneById(id)
    return Object.assign(post, { pv })
  }

  // @Get('pv/:id')
  // async increasePv(@Param('id', ObjectIdPipe) id: string): Promise<IPostPv> {
  //   return await this.postsService.increasePv(id)
  // }

  @UseGuards(JwtAuthGuard)
  @Get('like/:id')
  async likeOneByid(
    @Param('id', ObjectIdPipe) id: string,
    @Request() req,
  ): Promise<IPostLikes> {
    return await this.postsService.increaseLikes(id, req.user._id)
  }

  @Get(':id')
  async findOneById(@Param('id', ObjectIdPipe) id: string): Promise<PostType> {
    return await this.postsService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async create(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
  ): Promise<OperationEntity> {
    await this.postsService.create(req.user._id, createPostDto)
    return new OperationEntity('新建文章成功')
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Put('save')
  async update(
    @Body('id', ObjectIdPipe) id,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<OperationEntity> {
    await this.postsService.update(id, updatePostDto)
    return new OperationEntity('更新文章成功')
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('batchDelete')
  async batchDeleteByIds(@Body('ids') ids: string[]): Promise<OperationEntity> {
    await this.postsService.batchDeleteByIds(ids)
    return new OperationEntity('批量删除文章成功')
  }

  @UseGuards(JwtAuthGuard, UserChecker)
  @Delete(':id')
  async deleteById(
    @Param('id', ObjectIdPipe) id: string,
  ): Promise<OperationEntity> {
    await this.postsService.deleteById(id)
    return new OperationEntity('删除文章成功')
  }
}
