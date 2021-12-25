export type SignalData = unknown // todo: inspect and specify signal data type

export type Message = string // todo: use real simple-peer msg type

export type PeerEvent = 'stream' | 'data' | 'signal' | 'connect'

export declare class SimplePeer {
    constructor(opts: { initiator: boolean = false })

    destroy(): void
    signal(data: any): void
    send(msg: string): void

    on(event: PeerEvent, listener: (...args: any[]) => void): void
    off(event: PeerEvent, listener: (...args: any[]) => void): void

    addStream(stream: MediaStream): void
    removeStream(stream: MediaStream): void

    on(event: 'stream',  listener: (stream: MediaStream) => void): void 
    on(event: 'data',    listener: (msg: Message) => void       ): void
    on(event: 'signal',  listener: (data: SignalData) => void   ): void
    on(event: 'connect', listener: () => void                   ): void

    off(event: 'stream',  listener: (stream: MediaStream) => void): void 
    off(event: 'data',    listener: (msg: Message) => void       ): void
    off(event: 'signal',  listener: (data: SignalData) => void   ): void
    off(event: 'connect', listener: () => void                   ): void
}