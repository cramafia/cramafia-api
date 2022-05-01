import { ApiProperty } from '@nestjs/swagger'

export class ResponseUserDto {
  @ApiProperty()
  readonly _id: string

  @ApiProperty()
  readonly username: string

  @ApiProperty({
    required: false,
  })
  readonly icon_url?: string
}
