import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ example: 'flooded' })
  @IsString({ message: 'Should be string' })
  readonly username: string

  @ApiProperty({ example: '12345678' })
  @IsString({ message: 'Should be string' })
  @Length(4, 16, { message: 'Shoud be no less than 4 and no more than 16' })
  readonly password: string
}
