import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'

@ApiTags('Authorization Controller')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto)
  }

  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/refresh-token/:refresh_token')
  refreshToken(@Param('refresh_token') rt: string) {
    return this.authService.refreshToken(rt)
  }
}
