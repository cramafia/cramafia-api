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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UserDto } from './dto/respone-user.dto'

@ApiTags('Users Controller')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserDto] })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('all')
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<UserDto[]> {
    return this.usersService.getAll()
  }

  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 200, type: UserDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.createUser(createUserDto)
  }

  @ApiOperation({ summary: 'Get user by username' })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiParam({
    name: 'username',
    type: 'string',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':username')
  @HttpCode(HttpStatus.OK)
  getUserByUsername(@Param('username') username): Promise<UserDto> {
    return this.usersService.getUserByUsername(username)
  }
}
