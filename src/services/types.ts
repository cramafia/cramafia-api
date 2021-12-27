import { Server, Socket } from 'socket.io'

export type SocketEventHandlerConfig = Record<string, string>

export type SocketEventHandler = (
    config: SocketEventHandlerConfig,
    socket: Socket,
    io: Server
) => void

export type SocketEventHandlers = Record<string, SocketEventHandler>
