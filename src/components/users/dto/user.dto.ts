import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class UserDto {
  @ApiProperty()
  @IsString({ message: 'username should be string' })
  readonly username: string

  @ApiProperty()
  @IsString({ message: 'password should be string' })
  @Length(4, 16, {
    message: 'password shoud be no less than 4 and no more than 16',
  })
  readonly password: string
}
