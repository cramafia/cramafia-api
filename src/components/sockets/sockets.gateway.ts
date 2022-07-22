import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { CreateLobbyDto } from '../lobbies/dto/create-lobby.dto'
import { UpdateLobbyDto } from '../lobbies/dto/update-lobby-dto'
import { LobbiesService } from '../lobbies/lobbies.service'
import { UserDto } from '../users/dto/user.dto'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketsGateway {
  constructor(private readonly lobbiesService: LobbiesService) {}
  allActiveSockets: any[] = []

  @WebSocketServer() server: Server

  async emitGetAllSockets() {
    const allActiveSockets = [...(await this.server.allSockets())].length
    this.server.emit('getLiveUsersToClient', allActiveSockets)
  }

  async emitGetAllLobbies() {
    const allLobbies = await this.lobbiesService.getAll()
    this.server.emit('getAllLobbies', allLobbies)
  }

  clearSockets() {
    this.server.socketsJoin('leave')
    this.server.in('leave').disconnectSockets(true)
  }

  handleConnection(client: Socket) {
    console.log(`connected = ${client.id}`)
    this.emitGetAllSockets()
  }

  handleDisconnect(client: Socket) {
    console.log(`disconnected = ${client.id}`)
    this.emitGetAllSockets()
  }

  @SubscribeMessage('getLiveUsersToServer')
  async handleGetLiveUsers() {
    this.emitGetAllSockets()
  }

  @SubscribeMessage('getAllLobbies')
  async handleGetAllLobbies(client: Socket) {
    this.emitGetAllLobbies()
  }

  @SubscribeMessage('createLobby')
  async handleCreateLobby(client: Socket, data: CreateLobbyDto) {
    await this.lobbiesService.createLobby(data)
    this.emitGetAllLobbies()
  }

  @SubscribeMessage('connectPlayerToLobby')
  async handleConnectPlayerToLobby(
    client: Socket,
    {
      lobbyId,
      player,
    }: {
      lobbyId: string
      player: UserDto
    }
  ) {
    await this.lobbiesService.connectPlayerToLobby(lobbyId, player)
    this.emitGetAllLobbies()
  }

  @SubscribeMessage('disconnectPlayerFromLobby')
  async handleDisconnectPlayerFromLobby(
    client: Socket,
    {
      lobbyId,
      player,
    }: {
      lobbyId: string
      player: UserDto
    }
  ) {
    await this.lobbiesService.disconnectPlayerFromLobby(lobbyId, player)
    this.emitGetAllLobbies()
  }
}
