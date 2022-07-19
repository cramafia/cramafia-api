import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ResponseLobbyDto } from './dto/response-lobby.dto'
import { LobbiesService } from './lobbies.service'

@ApiTags('Lobby Controller')
@Controller('/lobbies')
export class LobbiesController {
  constructor(private readonly lobbiesService: LobbiesService) {}

  @ApiOperation({ summary: 'Get all lobbies' })
  @ApiResponse({ status: 200, type: [ResponseLobbyDto] })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('all')
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<ResponseLobbyDto[]> {
    return this.lobbiesService.getAll()
  }
}
