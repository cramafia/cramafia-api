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
import { JwtService } from '@nestjs/jwt'
import { CloudService } from '../cloud/cloud.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly cloudService: CloudService
  ) {}

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async getUserByToken(token: string) {
    const user = this.jwtService.verify(token)

    if (!user) {
      throw new ForbiddenException({
        message: 'This user does not exist!',
      })
    }

    return this.getUserByUsername(user.username)
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    await this.getUserByUsername(createUserDto.username, true)

    const icon_url = await this.cloudService.getRandomDefaultIcon()

    const newUser = new this.userModel({ ...createUserDto, icon_url })
    return newUser.save()
  }

  async updateUser(updateUserDto: UpdateUserDto, username: string) {
    await this.getUserByUsername(username)

    if (updateUserDto.avatarImage) {
      const url = await this.cloudService.uploadUserAvatar(
        updateUserDto.avatarImage
      )
      return this.userModel.findOneAndUpdate(
        { username },
        { ...updateUserDto, icon_url: url },
        {
          new: true,
        }
      )
    }

    return this.userModel.findOneAndUpdate({ username }, updateUserDto, {
      new: true,
    })
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
