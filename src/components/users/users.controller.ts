import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { User } from './schemas/user.schema'
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('Users Controller')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<User[]> {
    return this.usersService.getAll()
  }

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto)
  }

  @ApiOperation({ summary: 'Get user by username' })
  @ApiResponse({ status: 200, type: User })
  @ApiParam({
    name: 'username',
    type: 'string',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':username')
  @HttpCode(HttpStatus.OK)
  getUserByUsername(@Param('username') username): Promise<User> {
    return this.usersService.getUserByUsername(username)
  }
}
