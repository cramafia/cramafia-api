import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcryptjs'
import { User } from '../users/schemas/user.schema'
import { SALT, REFRESH_TOKEN_EXPIRES } from '../../constants'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto)
    return this.generateTokens(user)
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.usersService.getUserByUsername(
      userDto.username
    )
    if (candidate) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This user is exist!',
        },
        HttpStatus.FORBIDDEN
      )
    }

    const hashPassword = await bcrypt.hash(userDto.password, SALT)
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    })
    return this.generateTokens(user)
  }

  async refreshToken(rt: string) {
    let user = this.jwtService.verify(rt, {
      secret: process.env.JWT_REFRESH || 'REFRESH_TOKEN',
    })
    if (user) {
      return this.generateTokens(user)
    }
    throw new UnauthorizedException({
      message: 'Incorrect refresh token',
    })
  }

  private async generateTokens(user: User) {
    const payload = { username: user.username }
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH || 'REFRESH_TOKEN',
        expiresIn: REFRESH_TOKEN_EXPIRES,
      }),
    }
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.usersService.getUserByUsername(userDto.username)
    const passwordEq = await bcrypt.compare(userDto.password, user.password)
    if (user && passwordEq) {
      return user
    }
    throw new UnauthorizedException({
      message: 'Incorrect username or password',
    })
  }
}
