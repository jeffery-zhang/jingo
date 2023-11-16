import {
  Controller,
  Put,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common'

import { ObsService } from './obs.service'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { OperationEntity } from '../shared/entities/operation.entity'

@Controller('obs')
export class ObsController {
  constructor(private readonly obsService: ObsService) {}

  @Put('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return await this.obsService.uploadFile(file)
  }

  @Put('batchUpload')
  @UseInterceptors(FilesInterceptor('files'))
  async batchUpload(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<string[]> {
    console.log('batchUpload controller----- ', files)
    return await this.obsService.batchUpload(files)
  }

  @Delete('delete/:key')
  @UseGuards(JwtAuthGuard)
  async deleteByKey(@Param('key') key): Promise<OperationEntity> {
    await this.obsService.deleteByKey(key)
    return new OperationEntity(`删除${key}对象成功`)
  }
}
