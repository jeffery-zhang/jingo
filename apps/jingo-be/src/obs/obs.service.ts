import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { createHash } from 'crypto'

@Injectable()
export class ObsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private get obsPath() {
    return this.configService.get('OBS_PATH')
  }

  private get obsAuthKey() {
    return this.configService.get('OBS_AUTH_KEY')
  }

  private generateHashFilename(file: Express.Multer.File) {
    console.log(file)
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf-8',
    )
    const tmpFilename = file.originalname
    const ext = tmpFilename.substring(tmpFilename.lastIndexOf('.'))
    const hashFilename = createHash('md5').update(tmpFilename).digest('hex')
    return `${hashFilename}${ext}`
  }

  async uploadFile(file: Express.Multer.File) {
    const filename = this.generateHashFilename(file)
    const url = `${this.obsPath}/${filename}`
    const body = file.buffer
    const headers = {
      'X-Custom-Auth-Key': this.obsAuthKey,
    }

    const res = this.httpService
      .put(url, body, { headers })
      .subscribe((value) => {
        console.log('worker response: ', value)
      })
  }
}
