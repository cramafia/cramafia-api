import { Body, Controller, Post, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserDto } from '../users/dto/user.dto'
import { AuthService } from './auth.service'
import { TokensDto } from './dto/tokents.dto'

@ApiTags('Authorization Controller')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: TokensDto })
  @Post('/login')
  login(@Body() userDto: UserDto): Promise<TokensDto> {
    return this.authService.login(userDto)
  }

  @ApiOperation({ summary: 'Registration' })
  @ApiResponse({ status: 200, type: TokensDto })
  @Post('/registration')
  registration(@Body() userDto: UserDto): Promise<TokensDto> {
    return this.authService.registration(userDto)
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ status: 200, type: TokensDto })
  @Post('/refresh-token/:refresh_token')
  refreshToken(@Param('refresh_token') rt: string): Promise<TokensDto> {
    return this.authService.refreshToken(rt)
  }
}
