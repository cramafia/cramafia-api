const joinRoom = require('./joinRoom')
const { JOIN_ROOM } = require('../../shared/actions/actions')

module.exports = {
    [JOIN_ROOM]: joinRoom,
}
