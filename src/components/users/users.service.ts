import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './schemas/user.schema'
import { UserDto } from './dto/respone-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<UserDto[]> {
    return this.userModel.find().exec()
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
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

  async getUserByUsername(username: string): Promise<UserDto> {
    return this.userModel.findOne({ username: username }).exec()
  }
}
