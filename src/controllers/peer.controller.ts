import { Server, Socket } from 'socket.io'
import { PeerAction } from '../socket/actions/peer.action'
import {
    ClientSignal,
    ServerSignal,
    ConnectToData,
} from '../socket/dto/peer.dto'

type SignalHandler = (_: ClientSignal) => void

type PeerData = {
    uid: number
    socket: Socket
    signalHandler: SignalHandler
}

export class PeerController {
    constructor(server: Server, roomId: string) {
        this.server = server
        this.roomId = roomId
    }

    onPeerJoined(peerSocket: Socket): number {
        const peerUid = this.uidCounter++

        peerSocket.broadcast.to(this.roomId).emit(PeerAction.ConnectTo, <
            ConnectToData
        >{
            uids: [peerUid],
            initiate: false,
        })

        // peerUids mustn't contain peerUid (a self-connect attempt may occur)
        // todo: consider adding client-side block (with client knowing its uid)
        peerSocket.emit(PeerAction.ConnectTo, <ConnectToData>{
            uids: this.peerUids,
            initiate: true,
        })

        const self: PeerController = this
        const signalHandler = function (data: ClientSignal) {
            const addresseeIndex = self.peerIndexByUid(data.addresseeUid)
            self.peerSockets[addresseeIndex].emit(PeerAction.Signal, <
                ServerSignal
            >{
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

    private server: Server
    private roomId: string
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
}
