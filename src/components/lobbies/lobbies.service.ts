import { Injectable } from '@nestjs/common'
import { Lobby, LobbyDocument } from './schemas/lobby.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateLobbyDto } from './dto/create-lobby.dto'
import { ResponseLobbyDto } from './dto/response-lobby.dto'

@Injectable()
export class LobbiesService {
  constructor(
    @InjectModel(Lobby.name) private lobbyModel: Model<LobbyDocument>
  ) {}
  async getAll(): Promise<ResponseLobbyDto[]> {
    return this.lobbyModel.find().exec()
  }

  async createLobby(createLobbyDto: CreateLobbyDto) {
    const newLobby = new this.lobbyModel({ ...createLobbyDto })
    return newLobby.save()
  }
}
