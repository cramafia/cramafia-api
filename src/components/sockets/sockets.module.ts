import { forwardRef, Module } from '@nestjs/common'
import { LobbiesModule } from '../lobbies/lobbies.module'
import { UsersModule } from '../users/users.module'
import { SocketsGateway } from './sockets.gateway'

@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => LobbiesModule)],
  providers: [SocketsGateway],
  exports: [SocketsGateway],
})
export class SocketsModule {}
