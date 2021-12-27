import { SocketEventHandler } from 'src/services/types'
import { SocketActions } from '../actions/actions'

export const joinRoom: SocketEventHandler = (config, socket, io) => {
    const { room: roomID } = config
    const { rooms: joinedRooms } = socket

    if (Array.from(joinedRooms).includes(roomID)) {
        return console.warn(`Already joined to ${roomID}`)
    }

    const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || [])

    clients.forEach((clientID) => {
        io.to(clientID).emit(SocketActions.ADD_PEER, {
            peerID: socket.id,
            createOffer: false,
        })

        socket.emit(SocketActions.ADD_PEER, {
            peerID: clientID,
            createOffer: true,
        })
    })

    socket.join(roomID)
}
