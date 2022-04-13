import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema()
export class User {
  @ApiProperty({ example: 'flooded' })
  @Prop({ required: true })
  username: string

  @ApiProperty({ example: '12345678' })
  @Prop({ required: true })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
