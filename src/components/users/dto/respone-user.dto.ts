import { ApiProperty } from '@nestjs/swagger'

export class ResponseUserDto {
  @ApiProperty()
  readonly username: string

  @ApiProperty()
  readonly _id: string
}
