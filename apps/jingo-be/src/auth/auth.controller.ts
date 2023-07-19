import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt.stradegy'
import { RegisterDto } from './dtos/register.dto'
import { UserEntity } from '../users/entities/user.entity'
import { OperationEntity } from '../shared/entities/operation.entity'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('verify')
  public async verify(@Request() req): Promise<UserEntity> {
    const user = await this.authService.verify(req.user)
    return new UserEntity(user)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  public async login(@Body() body): Promise<UserEntity> {
    const user = await this.authService.login({
      username: body.username,
      password: body.password,
    })
    return new UserEntity(user)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  public async register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    const user = await this.authService.register(registerDto)
    return new UserEntity(user)
  }

  @UseGuards(JwtAuthGuard)
  @Put('changePwd')
  public async changePwd(
    @Request() req,
    @Body() body: { oldPwd: string; password: string },
  ): Promise<OperationEntity> {
    const id = req.user._id
    await this.authService.changePwd(id, body.oldPwd, body.password)
    return new OperationEntity('修改密码成功')
  }
}
