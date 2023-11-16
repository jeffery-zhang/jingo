import { Injectable, BadRequestException } from '@nestjs/common'
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
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf-8',
    )
    const tmpFilename = file.originalname
    const ext = tmpFilename.substring(tmpFilename.lastIndexOf('.'))
    const hashFilename = createHash('md5').update(tmpFilename).digest('hex')
    return `${hashFilename}${ext}`
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const filename = this.generateHashFilename(file)
    const url = `${this.obsPath}/${filename}`
    const body = file.buffer
    const headers = {
      'X-Custom-Auth-Key': this.obsAuthKey,
    }

    try {
      const res = await this.httpService.put(url, body, { headers }).toPromise()
      if (res.status === 200) {
        return url
      }
    } catch (err: any) {
      const msg = err.response?.data || '上传失败'
      throw new BadRequestException(msg)
    }
  }

  async batchUpload(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises: Promise<string>[] = []

    for (const file of files) {
      uploadPromises.push(this.uploadFile(file))
    }

    try {
      return await Promise.all(uploadPromises)
    } catch (err: any) {
      const msg = err.response?.message || '批量上传失败'
      throw new BadRequestException(msg)
    }
  }

  async deleteByKey(key: string): Promise<void> {
    const url = `${this.obsPath}/${key}`
    const headers = {
      'X-Custom-Auth-Key': this.obsAuthKey,
    }

    try {
      await this.httpService.delete(url, { headers }).toPromise()
    } catch (err) {
      throw new BadRequestException('删除失败')
    }
  }
}
