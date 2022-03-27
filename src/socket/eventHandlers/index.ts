import { SocketEventHandlers } from 'services/types'
import { SocketActions } from '../actions/actions'
import { joinRoom } from './joinRoom'

export const socketEvents: SocketEventHandlers = {
    [SocketActions.JOIN_ROOM]: joinRoom,
}