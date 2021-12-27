import { Server, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import { SocketEventHandlers } from 'src/services/types'

export class SocketController {
    io: Server
    constructor(server: HttpServer) {
        this.io = new Server(server)
    }

    addEventListeners(eventListeners: SocketEventHandlers) {
        this.io.on('connection', (socket: Socket) => {
            Object.keys(eventListeners).forEach((key) => {
                socket.on(key, eventListeners[key])
            })
        })
    }
}
