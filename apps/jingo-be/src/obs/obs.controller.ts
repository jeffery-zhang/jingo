import { Controller, Put, UseInterceptors, UploadedFile } from '@nestjs/common'

import { ObsService } from './obs.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('obs')
export class ObsController {
  constructor(private readonly obsService: ObsService) {}

  @Put('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    await this.obsService.uploadFile(file)
    return { message: '123321' }
  }
}
