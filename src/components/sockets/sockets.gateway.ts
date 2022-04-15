import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { UsersService } from '../users/users.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketsGateway {
  constructor(private readonly usersService: UsersService) {}

  @WebSocketServer() server: Server

  @SubscribeMessage('userConnected')
  handleEvent() {
    this.usersService.liveUsers += 1
    this.server.emit('liveUsersChanged', this.usersService.liveUsers)
  }

  handleDisconnect() {
    this.usersService.liveUsers -= 1
    this.server.emit('liveUsersChanged', this.usersService.liveUsers)
  }
}
