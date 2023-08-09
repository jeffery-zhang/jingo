import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { ObsController } from './obs.controller'
import { ObsService } from './obs.service'

@Module({
  imports: [
    HttpModule.register({
      timeout: 30 * 1000,
    }),
  ],
  providers: [ObsService],
  controllers: [ObsController],
  exports: [ObsService],
})
export class ObsModule {}
