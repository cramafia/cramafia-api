import { ApiProperty } from '@nestjs/swagger'

import { LobbyGameType, LobbyGamePrivacy } from '../types/common'

export class UpdateLobbyDto {
  @ApiProperty({
    enum: [LobbyGameType.CLASSIC, LobbyGameType.CUSTOM],
    required: false,
  })
  readonly type?: LobbyGameType

  @ApiProperty({
    required: false,
  })
  readonly name?: string

  @ApiProperty({
    required: false,
  })
  readonly players?: number

  @ApiProperty({
    required: false,
  })
  readonly maxPlayers?: number

  @ApiProperty({
    required: false,
  })
  readonly privacy?: LobbyGamePrivacy.PRIVATE | LobbyGamePrivacy.PUBLIC
}
