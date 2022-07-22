import { ForbiddenException, Injectable } from '@nestjs/common'
import { Lobby, LobbyDocument } from './schemas/lobby.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateLobbyDto } from './dto/create-lobby.dto'
import { ResponseLobbyDto } from './dto/response-lobby.dto'
import { UpdateLobbyDto } from './dto/update-lobby-dto'
import { UserDto } from '../users/dto/user.dto'

@Injectable()
export class LobbiesService {
  constructor(
    @InjectModel(Lobby.name) private lobbyModel: Model<LobbyDocument>
  ) {}
  async getAll(): Promise<ResponseLobbyDto[]> {
    return this.lobbyModel.find().exec()
  }

  async updateLobby(lobbyId: string, data: UpdateLobbyDto) {
    const updatedLobby = await this.lobbyModel.findOneAndUpdate(
      { lobbyId },
      data,
      {
        new: true,
      }
    )
    return updatedLobby.save()
  }

  async connectPlayerToLobby(lobbyId: string, player: UserDto) {
    const lobby = await this.getLobbyById(lobbyId)

    if (lobby.players === lobby.maxPlayers) {
      throw new ForbiddenException({
        message: 'Lobby is full!',
      })
    }
    const updatedLobby = await this.updateLobby(lobbyId, {
      players: lobby.players + 1,
    })
    return updatedLobby.save()
  }

  async disconnectPlayerFromLobby(lobbyId: string, player: UserDto) {
    const lobby = await this.getLobbyById(lobbyId)

    const updatedLobby = await this.updateLobby(lobbyId, {
      players: lobby.players - 1,
    })
    return updatedLobby.save()
  }

  async getLobbyById(id: string): Promise<Lobby> {
    const lobby = await this.lobbyModel.findOne({ lobbyId: id }).exec()
    if (!lobby) {
      throw new ForbiddenException({
        message: 'Lobby not found!',
      })
    }
    return lobby
  }

  async createLobby(createLobbyDto: CreateLobbyDto) {
    const newLobby = new this.lobbyModel({ ...createLobbyDto, players: 0 })
    return newLobby.save()
  }
}
