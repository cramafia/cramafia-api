import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type LobbyDocument = Lobby & Document

@Schema()
export class Lobby {
  @Prop()
  lobbyId: string
}

export const LobbySchema = SchemaFactory.createForClass(Lobby)
