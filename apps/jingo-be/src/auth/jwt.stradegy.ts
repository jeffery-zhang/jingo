import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard, PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

export class JwtEntity {
  _id: string
  username: string
  roles: string[]
}

@Injectable()
export class JwtStradegy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  async validate(payload: any): Promise<JwtEntity> {
    return {
      _id: payload.sub,
      username: payload.username,
      roles: payload.roles,
    }
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
