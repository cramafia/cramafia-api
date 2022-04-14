import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty()
  readonly username: string

  @ApiProperty()
  readonly _id: string

  @ApiProperty()
  readonly password: string

  @ApiProperty()
  readonly refresh_token?: string | null
}
