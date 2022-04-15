import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { SALT } from 'src/constants'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { User } from './schemas/user.schema'
import { ResponseUserDto } from './dto/respone-user.dto'
import { UsersInterceptor } from './users.interceptor'

@ApiTags('Users Controller')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [ResponseUserDto] })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UsersInterceptor)
  @ApiBearerAuth()
  @Get('all')
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<User[]> {
    return this.usersService.getAll()
  }

  @ApiOperation({ summary: 'Get current users' })
  @ApiResponse({ status: 200, type: [ResponseUserDto] })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UsersInterceptor)
  @ApiBearerAuth()
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Headers('Authorization') auth: string): Promise<User> {
    const token = auth.split(' ')[1]
    return this.usersService.getUserByToken(token)
  }

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 200, type: ResponseUserDto })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UsersInterceptor)
  @ApiBearerAuth()
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await bcrypt.hash(createUserDto.password, SALT)
    return this.usersService.createUser({
      ...createUserDto,
      password: hashPassword,
    })
  }

  @ApiOperation({ summary: 'Get user by username' })
  @ApiResponse({ status: 200, type: ResponseUserDto })
  @ApiParam({
    name: 'username',
    type: 'string',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UsersInterceptor)
  @ApiBearerAuth()
  @Get(':username')
  @HttpCode(HttpStatus.OK)
  async getUserByUsername(@Param('username') username): Promise<User> {
    return this.usersService.getUserByUsername(username)
  }
}
