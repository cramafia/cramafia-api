import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { User } from './schemas/user.schema'
import { ResponseUserDto } from './dto/respone-user.dto'
import { UsersInterceptor } from './users.interceptor'
import { UpdateUserDto } from './dto/update-user.dto'

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
  async getCurrentUser(@Request() { user }: { user: User }): Promise<User> {
    return user
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: ResponseUserDto })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UsersInterceptor)
  @ApiBearerAuth()
  @Patch('me/update')
  @HttpCode(HttpStatus.CREATED)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Request() { user }: { user: User }
  ): Promise<User> {
    return this.usersService.updateUser(updateUserDto, user.username)
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
