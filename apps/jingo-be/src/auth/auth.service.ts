import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcrypt'
import { encryptPassword } from '@jingo/utils'

import { UsersService } from '../users/users.service'
import { RegisterDto } from './dtos/register.dto'
import { User } from '../users/schemas/user.schema'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private generateJwt(user: User): string {
    const payload = {
      username: user.username,
      sub: user._id,
      roles: user.roles,
    }
    return this.jwtService.sign(payload)
  }

  public async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneByUsername(username)
    if (user) {
      if (!compareSync(password, user.password)) {
        throw new BadRequestException('密码不正确')
      }
      return user
    }
    return null
  }

  public async verify(user: any): Promise<User> {
    const verified = await this.userService.findOneById(user._id)
    if (!verified) return null
    return verified
  }

  public async login(body: {
    username: string
    password: string
  }): Promise<User & { token: string }> {
    const user = await this.validateUser(body.username, body.password)
    const token = this.generateJwt(user)
    return Object.assign(user, { token })
  }

  public async register(
    registerDto: RegisterDto,
  ): Promise<User & { token: string }> {
    const { username, mail } = registerDto
    const valid = await this.userService.validateUsernameAndMail(username, mail)
    if (!valid) return null
    const user = await this.userService.create(registerDto)
    const token = this.generateJwt(user)
    return Object.assign(user, { token })
  }

  public async changePwd(id: string, oldPwd: string, newPwd: string) {
    if (!oldPwd || !newPwd) throw new BadRequestException('密码不能为空')
    const user = await this.userService.findOneById(id)
    if (!compareSync(oldPwd, user.password)) {
      throw new ForbiddenException('原密码不正确')
    }
    const password = await encryptPassword(newPwd)
    return await this.userService.update(id, { password })
  }
}
