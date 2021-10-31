const { ADD_PEER } = require('../actions')

const joinRoom = (config, socket, io) => {
    const {room: roomID} = config;
    const {rooms: joinedRooms} = socket;

    if (Array.from(joinedRooms).includes(roomID)) {
        return console.warn(`Already joined to ${roomID}`);
    }

    const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

    clients.forEach(clientID => {
        io.to(clientID).emit(ADD_PEER, {
            peerID: socket.id,
            createOffer: false
        });

        socket.emit(ADD_PEER, {
            peerID: clientID,
            createOffer: true,
        });
    });

    socket.join(roomID)
}

module.exports = joinRoom