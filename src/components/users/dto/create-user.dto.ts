import { ApiProperty } from '@nestjs/swagger'
import { UserDto } from './user.dto'

export class CreateUserDto extends UserDto {
  @ApiProperty({
    required: false,
  })
  readonly refresh_token?: string | null
}
