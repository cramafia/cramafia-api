import { ApiProperty } from '@nestjs/swagger'

export class ResponseUserDto {
  @ApiProperty()
  readonly _id: string

  @ApiProperty()
  readonly username: string
}
