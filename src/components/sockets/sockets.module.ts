import { forwardRef, Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { SocketsGateway } from './sockets.gateway'

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [SocketsGateway],
  exports: [SocketsGateway],
})
export class SocketsModule {}
