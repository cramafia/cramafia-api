import { Server, Socket } from 'socket.io'
import { PeerAction } from '../shared/actions/peer.action'
import { ClientSignal, ServerSignal, ConnectToData }
    from '../shared/dto/peer.dto'

type SignalHandler = (_: ClientSignal) => void

type PeerData = {
    uid: number,
    socket: Socket,
    signalHandler: SignalHandler
}

export class PeerController {
    constructor(server: Server, roomId: string) {
        this.server = server
        this.roomId = roomId
    }

    onPeerJoined(peerSocket: Socket): number {
        const peerUid = this.uidCounter++

        // a notice to prepare for connection with new peer
        peerSocket.broadcast // to everyone except the newly connected one
            .to(this.roomId) // in this room
            .emit(PeerAction.ConnectTo, <ConnectToData>{
                uids: [peerUid],
                initiate: false,
            })

        // newly connected initiates connection to others
        // ! peerUids must not contain peerUid
        // ? (to add client-side block client should know it's uid)
        peerSocket.emit(PeerAction.ConnectTo, <ConnectToData>{
            uids: this.peerUids,
            initiate: true,
        })

        // mediate signals
        const self: PeerController = this
        const signalHandler = function(data: ClientSignal) {
            const addresseeIndex = self.peerIndexByUid(data.addresseeUid)
            self.peerSockets[addresseeIndex].emit(PeerAction.Signal,
                <ServerSignal>{
                    addresserUid: peerUid,
                    signalData: data.signalData,
                })
        }
        peerSocket.on(PeerAction.Signal, signalHandler)
        this.peerSignalHandlers.push(signalHandler)

        this.peerUids.push(peerUid)
        this.peerSockets.push(peerSocket)

        return peerUid
    }

    onPeerLeaved(peerSocket: Socket): void {
        const index = this.peerSockets.findIndex((s) => s.id === peerSocket.id)
        this.peerDestroyAt(index)

        this.peerUids.splice(index, 1)
        this.peerSockets.splice(index, 1)
        this.peerSignalHandlers.splice(index, 1)
    }

    destroy() {
        for (let i = 0; i < this.peerUids.length; ++i) {
            this.peerDestroyAt(i)
        }
        this.peerUids = []
        this.peerSockets = []
        this.peerSignalHandlers = []
    }

    private uidCounter: number = 0

    private peerUids: number[] = []
    private peerSockets: Socket[] = []
    private peerSignalHandlers: SignalHandler[] = []

    private peerIndexByUid(uid: number): number {
        return this.peerUids.findIndex((auid) => auid === uid)
    }

    private peerDataAt(index: number): PeerData {
        return {
            uid: this.peerUids[index],
            socket: this.peerSockets[index],
            signalHandler: this.peerSignalHandlers[index],
        }
    }

    // removes peer's signal handler and emits disconnected event
    // ! does not change arrays
    private peerDestroyAt(index: number) {
        const { uid, socket, signalHandler } = this.peerDataAt(index)
        socket.off(PeerAction.Signal, signalHandler)
        this.server.to(this.roomId).emit(PeerAction.LeavedNet, uid)
    }

    private server: Server
    private roomId: string
}
