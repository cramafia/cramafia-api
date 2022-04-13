import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './components/auth/auth.module'
import { UsersModule } from './components/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UsersModule,
    AuthModule,
    MongooseModule.forRoot(process.env.DB_CONNECTION_URL || ''),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
