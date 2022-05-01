import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './schemas/user.schema'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) {}

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async getRandomDefaultIcon() {
    try {
      const { resources } = await cloudinary.api.resources({
        resource_type: 'image',
        type: 'upload',
        prefix: 'cramafia/default_icons/',
      })
      const randomIndex = Math.round(Math.random() * (resources.length - 1))

      return resources[randomIndex].url
    } catch (e) {
      throw new ForbiddenException({
        message: e.error.message,
      })
    }
  }

  async uploadUserAvatar(image: string) {
    try {
      const { url } = await cloudinary.uploader.upload(image, {
        folder: 'cramafia/users_avatars',
      })

      return url
    } catch (e) {
      throw new ForbiddenException({
        message: e.error.message,
      })
    }
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

    const icon_url = await this.getRandomDefaultIcon()

    const newUser = new this.userModel({ ...createUserDto, icon_url })
    return newUser.save()
  }

  async updateUser(updateUserDto: UpdateUserDto, username: string) {
    await this.getUserByUsername(username)

    if (updateUserDto.avatarImage) {
      const url = await this.uploadUserAvatar(updateUserDto.avatarImage)
      return this.userModel.findOneAndUpdate(
        { username },
        { ...updateUserDto, icon_url: url }
      )
    }

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
