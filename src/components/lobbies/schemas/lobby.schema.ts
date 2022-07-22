import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import {
  LobbyGameType,
  LobbyGameStatus,
  LobbyGamePrivacy,
} from '../types/common'

export type LobbyDocument = Lobby & Document

@Schema()
export class Lobby {
  @Prop()
  lobbyId: string

  @Prop()
  type: LobbyGameType

  @Prop()
  name: string

  @Prop()
  players: number

  @Prop()
  maxPlayers: number

  @Prop()
  status: LobbyGameStatus

  @Prop()
  privacy: LobbyGamePrivacy
}

export const LobbySchema = SchemaFactory.createForClass(Lobby)
