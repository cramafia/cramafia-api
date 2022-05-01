import { Module } from '@nestjs/common'
import { CloudService } from '../cloud/cloud.service'

@Module({
  providers: [CloudService],
  controllers: [],
  imports: [],
  exports: [CloudService],
})
export class CloudModule {}
