import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UsersService } from '../users/users.service'
import _ from 'lodash'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketsGateway {
  allActiveSockets: any[] = []
  curr: any = []
  constructor(private readonly usersService: UsersService) {}

  @WebSocketServer() server: Server

  async emitGetAllSockets() {
    const allActiveSockets = [...(await this.server.allSockets())].length
    this.server.emit('getLiveUsersToClient', allActiveSockets)
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
}
