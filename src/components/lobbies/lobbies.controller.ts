import { Body, Controller, Post, Param, Get, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { LobbiesService } from './lobbies.service'

@ApiTags('Lobby Controller')
@Controller('/lobbies')
export class LobbiesController {
  constructor(private readonly lobbiesService: LobbiesService) {}

  @ApiOperation({ summary: 'Get all lobbies' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('all')
  getAll() {
    return this.lobbiesService.getAll()
  }
}
