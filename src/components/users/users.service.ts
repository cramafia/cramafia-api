import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './schemas/user.schema'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    await this.getUserByUsername(createUserDto.username, true)

    const newUser = new this.userModel(createUserDto)
    return newUser.save()
  }

  async updateUser(updateUserDto: UpdateUserDto, username: string) {
    await this.getUserByUsername(username)

    return this.userModel.findOneAndUpdate({ username }, updateUserDto)
  }

  async getUserByUsername(
    username: string,
    isExistException = false
  ): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec()
    if (isExistException && !!user) {
      throw new ForbiddenException({
        message: 'This user is exist!',
      })
    }
    if (!isExistException && !user) {
      throw new NotFoundException({
        message: 'User with this username does not exist!',
      })
    }
    return user
  }
}
