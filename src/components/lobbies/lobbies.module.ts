import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { LobbiesController } from './lobbies.controller'
import { LobbiesService } from './lobbies.service'
import { Lobby, LobbySchema } from './schemas/lobby.schema'

@Module({
  providers: [LobbiesService],
  controllers: [LobbiesController],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: Lobby.name, schema: LobbySchema }]),
  ],
  exports: [LobbiesService],
})
export class LobbiesModule {}
