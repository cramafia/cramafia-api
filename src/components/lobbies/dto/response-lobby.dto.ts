import { ApiProperty } from '@nestjs/swagger'

import { CreateLobbyDto } from './create-lobby.dto'
import { LobbyGameStatus } from '../types/common'

export class ResponseLobbyDto extends CreateLobbyDto {
  @ApiProperty({
    enum: [
      LobbyGameStatus.GAME_IN_PROGRESS,
      LobbyGameStatus.WAITING_FOR_PLAYERS,
    ],
  })
  readonly status: LobbyGameStatus

  @ApiProperty()
  readonly players: number

  @ApiProperty()
  readonly maxPlayers: number
}
