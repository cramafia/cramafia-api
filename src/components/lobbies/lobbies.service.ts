import { Injectable } from '@nestjs/common'
import { Lobby, LobbyDocument } from './schemas/lobby.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class LobbiesService {
  constructor(
    @InjectModel(Lobby.name) private lobbyModel: Model<LobbyDocument>
  ) {}
  async getAll(): Promise<Lobby[]> {
    return this.lobbyModel.find().exec()
  }

  async createLobby(createLobbyDto: Lobby) {
    const newLobby = new this.lobbyModel({ ...createLobbyDto })
    return newLobby.save()
  }
}
