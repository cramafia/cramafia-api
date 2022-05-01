import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({
    required: false,
  })
  readonly username?: string

  @ApiProperty({
    required: false,
  })
  readonly icon_url?: string

  @ApiProperty({
    required: false,
  })
  readonly avatarImage?: string

  @ApiProperty({
    required: false,
  })
  readonly password?: string

  @ApiProperty({
    required: false,
  })
  readonly refresh_token?: string | null
}
