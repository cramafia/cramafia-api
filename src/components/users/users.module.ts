import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersController } from './users.controller'
import { User, UserSchema } from './schemas/user.schema'
import { UsersService } from './users.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
