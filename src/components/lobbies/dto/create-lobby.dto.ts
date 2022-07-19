import { ApiProperty } from '@nestjs/swagger'

import { LobbyGameType, LobbyGamePrivacy } from '../types/common'

export class CreateLobbyDto {
  @ApiProperty()
  readonly lobbyId: string

  @ApiProperty({ enum: [LobbyGameType.CLASSIC, LobbyGameType.CUSTOM] })
  readonly type: LobbyGameType

  @ApiProperty()
  readonly name: string

  @ApiProperty()
  readonly privacy: LobbyGamePrivacy.PRIVATE | LobbyGamePrivacy.PUBLIC
}
