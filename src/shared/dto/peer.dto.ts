export type ClientSignal = {
    signalData: any,
    addresseeUid: number
}

export type ServerSignal = {
    signalData: any,
    addresserUid: number
}

export type ConnectToData = {
    uids: number[],
    initiate: boolean
}
