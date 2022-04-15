import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcryptjs'
import { SALT, REFRESH_TOKEN_EXPIRES } from '../../constants'
import { TokensDto } from './dto/tokents.dto'
import { User } from '../users/schemas/user.schema'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(userDto: CreateUserDto): Promise<TokensDto> {
    const user = await this.validateUser(userDto)
    const tokens = await this.generateTokens(user)

    this.usersService.updateUser(
      { refresh_token: tokens.refresh_token },
      user.username
    )

    return tokens
  }

  async registration(userDto: CreateUserDto): Promise<TokensDto> {
    const tokens = await this.generateTokens(userDto)
    const hashPassword = await bcrypt.hash(userDto.password, SALT)

    await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
      refresh_token: tokens.refresh_token,
    })

    return tokens
  }

  async refreshToken(rt: string): Promise<TokensDto> {
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
    const isRefreshExist = user.refresh_token === rt

    if (!isRefreshExist) {
      throw new UnauthorizedException({
        message: 'Refresh token does not exist',
      })
    }

    this.usersService.updateUser({ refresh_token: rt }, user.username)

    return this.generateTokens(user)
  }

  private async generateTokens(user: CreateUserDto): Promise<TokensDto> {
    const payload = { username: user.username }

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH || 'REFRESH_TOKEN',
        expiresIn: REFRESH_TOKEN_EXPIRES,
      }),
    }
  }

  private async validateUser(userDto: CreateUserDto): Promise<User> {
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
