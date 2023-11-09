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
import { LoginDto } from './dtos/login.dto'
import { ChangePwdDto } from './dtos/changePwd.dto'
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
  public async login(@Body() body: LoginDto): Promise<UserEntity> {
    const user = await this.authService.login(body)
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
    @Body() body: ChangePwdDto,
  ): Promise<OperationEntity> {
    const id = req.user._id
    await this.authService.changePwd(id, body.oldPwd, body.newPwd)
    return new OperationEntity('修改密码成功')
  }
}
