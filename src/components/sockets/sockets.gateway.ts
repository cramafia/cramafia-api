import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { LobbiesService } from '../lobbies/lobbies.service'
import { Lobby } from '../lobbies/schemas/lobby.schema'

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

  async emitGetAllLobbies(client: Socket) {
    const allLobbies = await this.lobbiesService.getAll()
    client.emit('getAllLobbies', allLobbies)
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
    this.emitGetAllLobbies(client)
  }

  @SubscribeMessage('createLobby')
  async handleCreateLobby(client: Socket, data: Lobby) {
    await this.lobbiesService.createLobby(data)
    this.emitGetAllLobbies(client)
  }
}
