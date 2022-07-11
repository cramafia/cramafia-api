import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './components/auth/auth.module'
import { UsersModule } from './components/users/users.module'
import { SocketsGateway } from './components/sockets/sockets.gateway'
import { LobbiesModule } from './components/lobbies/lobbies.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UsersModule,
    AuthModule,
    LobbiesModule,
    MongooseModule.forRoot(process.env.DB_CONNECTION_URL || ''),
  ],
  controllers: [],
  providers: [SocketsGateway],
})
export class AppModule {}
