import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './schemas/user.schema'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/respone-user.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<UserDto[]> {
    const allUsers = await this.userModel.find().exec()
    return allUsers.map(this.getUserData)
  }

  getUserData(user: User): UserDto {
    return {
      username: user.username,
      _id: user._id,
    }
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
    }
    const newUser = new this.userModel(createUserDto)
    return newUser.save()
  }

  async updateUser(updateUserDto: UpdateUserDto, username: string) {
    const user = await this.getUserByUsername(username)

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'User with this username does not exist!',
        },
        HttpStatus.FORBIDDEN
      )
    }

    return this.userModel.findOneAndUpdate({ username }, updateUserDto)
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username: username }).exec()
  }
}
