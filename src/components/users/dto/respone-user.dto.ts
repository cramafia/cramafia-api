import { ApiProperty } from '@nestjs/swagger'
import { UserStatus } from '../schemas/user.schema'

export class ResponseUserDto {
  @ApiProperty()
  readonly _id: string

  @ApiProperty()
  readonly username: string

  @ApiProperty()
  readonly status: UserStatus
}
