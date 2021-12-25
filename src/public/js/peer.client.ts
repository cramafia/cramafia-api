import { PeerAction } from '@shared/actions/peer.action'
import { ArrayView } from '@shared/arrayView'
import { ClientSignal, ConnectToData, ServerSignal } from '@shared/dto/peer.dto'
import { Socket } from 'socket.io-client'
import { Message, SimplePeer } from './lib/simple-peer'
import video from './video'

export class PeerNotConnectedError extends Error {
    constructor(...params: any[]) {
        super(...params)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PeerNotConnectedError)
        }
        this.name = 'PeerNotConnectedError'
    }
}

export const enum PeerClientEvent {
    Connecting = '~',
    Connected = '+',
    Disconnected = '-',
    DataRecieved = 'd'
}

type StreamHandler = (stream: MediaStream) => void

type Connection = {
    uid: number,
    peer: SimplePeer,
    isConnected: boolean,
    stream?: MediaStream,
    streamHandler?: StreamHandler
}

export class PeerClient extends EventTarget {
    constructor(socket: Socket) {
        super()
        this.socket = socket

        this.socket.on(PeerAction.Signal, this.signalHandler)
        this.socket.on(PeerAction.ConnectTo, this.peerConnectHandler)
        this.socket.on(PeerAction.LeavedNet, this.peerDisconnectedHandler)
    }

    destroy() {
        this.socket.off(PeerAction.Signal, this.signalHandler)
        this.socket.off(PeerAction.ConnectTo, this.peerConnectHandler)
        this.socket.off(PeerAction.LeavedNet, this.peerDisconnectedHandler)

        for (let i = 0; i < this.connections.length; ++i) {
            this.connections[i].peer.destroy()
        }
        this.connections = []
    }

    // ! index with .at(index)
    viewConnected() {
        return new ArrayView(this.connections.map((c) => ({
            uid: c.uid,
            isConnected: c.isConnected,
        })))
    }


    // Streaming

    startStreamingTo(uid: number, mediaStream: MediaStream) {
        this.startStreamingToI(this.connectionIndexByUid(uid), mediaStream)
    }

    stopStreamingTo(uid: number) {
        this.stopStreamingToI(this.connectionIndexByUid(uid))
    }

    startStreamingToAll(mediaStream: MediaStream) {
        for (let i = 0; i < this.connections.length; ++i) {
            this.startStreamingToI(i, mediaStream)
        }
    }

    stopStreamingToAll() {
        for (let i = 0; i < this.connections.length; ++i) {
            this.stopStreamingToI(i)
        }
    }

    startStreamingToI(index: number, mediaStream: MediaStream) {
        this.connections[index].peer.addStream(mediaStream)
        this.connections[index].stream = mediaStream
    }

    stopStreamingToI(index: number) {
        const stream = this.connections[index].stream
        if (stream === undefined) {
            console.warn('Tried to stop non-existent stream')
            return
        }
        this.connections[index].peer.removeStream(stream)
        this.connections[index].stream = undefined
    }


    // Stream subscribtion

    subscribeForStreamFrom(uid: number, videoElement: HTMLVideoElement) {
        const index = this.connectionIndexByUid(uid)
        this.subscribeForStreamFromI(index, videoElement)
    }

    subscribeForStreamFromI(index: number, videoElement: HTMLVideoElement) {
        const streamHandler = (stream: MediaStream) => {
            video.useStream(videoElement, stream)
        }
        this.connections[index].streamHandler = streamHandler
        this.connections[index].peer.on('stream', streamHandler)
    }

    unsubscribeFromStreamFrom(uid: number, videoElement: HTMLVideoElement) {
        const index = this.connectionIndexByUid(uid)
        this.unsubscribeFromStreamFromI(index, videoElement)
    }

    unsubscribeFromStreamFromI(index: number, videoElement: HTMLVideoElement) {
        const streamHandler = this.connections[index].streamHandler
        if (streamHandler === undefined) {
            console.warn('Tried to unsubscribe from not-subscribed-to stream')
            return
        }
        this.connections[index].peer.off('stream', streamHandler)
        this.connections[index].streamHandler = undefined
        video.offStream(videoElement) // todo: that's stupid
    }

    isSubscribedToStreamFrom(uid: number) {
        const index = this.connectionIndexByUid(uid)
        return index !== -1 ? this.isSubscribedToStreamFromI(index) : false
    }

    isSubscribedToStreamFromI(index: number) {
        return this.connections[index].streamHandler !== undefined
    }


    // Data communication

    // send text/binary data
    send(uid: number, msg: Message) {
        this.sendI(this.connectionIndexByUid(uid), msg)
    }

    sendI(index: number, msg: Message) {
        if (!this.connections[index].isConnected) {
            throw new PeerNotConnectedError()
        }
        this.connections[index].peer.send(msg)
    }


    private connections: Connection[] = []
    private socket: Socket

    connectionIndexByUid(uid: number) {
        return this.connections.findIndex((c) => c.uid === uid)
    }

    private addConnection(uid: number, initiator: boolean) {
        const peer = new SimplePeer({ initiator })
        const index = this.connections.length
        this.connections.push({ uid, peer, isConnected: false })

        peer.on('connect', () => {
            this.connections[index].isConnected = true

            this.dispatchEvent(new CustomEvent(PeerClientEvent.Connected, {
                detail: { uid },
            }))
        })

        peer.on('signal', (data) => {
            this.socket.emit(PeerAction.Signal, <ClientSignal>{
                addresseeUid: uid,
                signalData: data,
            })
        })

        peer.on('data', (data) => {
            this.dispatchEvent(new CustomEvent(PeerClientEvent.DataRecieved, {
                detail: { data },
            }))
        })

        this.dispatchEvent(new CustomEvent(PeerClientEvent.Connecting, {
            detail: { uid },
        }))
    }


    private signalHandler = (sdp: ServerSignal) => {
        const index = this.connectionIndexByUid(sdp.addresserUid)
        this.connections[index].peer.signal(sdp.signalData)
    }

    private peerConnectHandler = (data: ConnectToData) => {
        data.uids.forEach((uid: number) => {
            this.addConnection(uid, data.initiate)
        })
    }

    private peerDisconnectedHandler = (uid: number) => {
        const index = this.connectionIndexByUid(uid)
        this.dispatchEvent(new CustomEvent(PeerClientEvent.Disconnected, {
            detail: { uid, index },
        }))

        this.connections[index].peer.destroy()
        this.connections.splice(index, 1)
    }
}
