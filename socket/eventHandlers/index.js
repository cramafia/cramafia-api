const joinRoom = require('./joinRoom')
const { JOIN_ROOM } = require('../actions')

module.exports = {
    [JOIN_ROOM]: joinRoom,
}