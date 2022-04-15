import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length, IsEnum } from 'class-validator'
import { UserStatus } from '../schemas/user.schema'

export class UpdateUserDto {
  @ApiProperty()
  @IsString({ message: 'Should be string' })
  readonly username?: string

  @ApiProperty()
  @IsString({ message: 'Should be string' })
  @Length(4, 16, { message: 'Shoud be no less than 4 and no more than 16' })
  readonly password?: string

  @ApiProperty()
  @IsEnum(UserStatus, { message: 'Status should be valid' })
  readonly status?: UserStatus

  @ApiProperty()
  readonly refresh_token?: string | null
}
