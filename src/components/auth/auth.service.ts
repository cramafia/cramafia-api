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
import { SALT, REFRESH_TOKEN_EXPIRES } from '../../constants'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto)
    const tokens = await this.generateTokens(user)

    this.usersService.updateUser(
      { refresh_token: tokens.refresh_token },
      user.username
    )

    return tokens
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
    const tokenPayload = this.jwtService.verify(rt, {
      secret: process.env.JWT_REFRESH || 'REFRESH_TOKEN',
    })
    if (!tokenPayload) {
      throw new UnauthorizedException({
        message: 'Incorrect refresh token',
      })
    }
    const user = await this.usersService.getUserByUsername(
      tokenPayload.username
    )

    if (!user) {
      throw new UnauthorizedException({
        message: 'User did not found',
      })
    }

    const isRefreshExist = user.refresh_token === rt

    if (!isRefreshExist) {
      throw new UnauthorizedException({
        message: 'Refresh token does not exist',
      })
    }

    this.usersService.updateUser({ refresh_token: rt }, user.username)

    return this.generateTokens(user)
  }

  private async generateTokens(user: CreateUserDto) {
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
