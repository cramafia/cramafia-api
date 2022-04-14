import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema()
export class User {
  @ApiProperty({ example: '12345678' })
  @Prop({ required: false })
  refresh_token: string | null

  @ApiProperty({ example: 'flooded' })
  @Prop({ required: true })
  username: string

  @ApiProperty({ example: '12345678' })
  @Prop({ required: true })
  password: string

  @ApiProperty({ example: 'asd' })
  _id: string
}

export const UserSchema = SchemaFactory.createForClass(User)