import {
  Controller,
  Put,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common'

import { ObsService } from './obs.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/jwt.stradegy'
import { OperationEntity } from '../shared/entities/operation.entity'

@Controller('obs')
export class ObsController {
  constructor(private readonly obsService: ObsService) {}

  @Put('uploadFile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return await this.obsService.uploadFile(file)
  }

  @Delete('delete/:key')
  @UseGuards(JwtAuthGuard)
  async deleteByKey(@Param('key') key): Promise<OperationEntity> {
    await this.obsService.deleteByKey(key)
    return new OperationEntity(`删除${key}对象成功`)
  }
}
