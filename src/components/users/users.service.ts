import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.getUserByUsername(createUserDto.username)
    if (!!user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This user is exist!',
        },
        HttpStatus.FORBIDDEN
      )
    } else {
      const newUser = new this.userModel(createUserDto)
      return newUser.save()
    }
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username: username }).exec()
  }
}
