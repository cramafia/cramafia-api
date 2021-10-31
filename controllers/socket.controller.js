const io = require('socket.io')

class SocketController {
    constructor(server) {
        this.io = io(server)
    }

    addEventListeners(eventListeners) {
        this.io.on('connection', (socket) => {
            Object.keys(eventListeners).forEach(key => {
                socket.on(key, eventListeners[key])
            })
        })
    }
}

module.exports = {
    SocketController
}