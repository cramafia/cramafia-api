import { forwardRef, Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '../users/users.module'
import { ACCESS_TOKEN_EXPIRES } from '../../constants'

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET',
      signOptions: {
        expiresIn: ACCESS_TOKEN_EXPIRES,
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
