export default {
    useStream(videoElement: HTMLVideoElement, mediaStream: MediaStream) {
        videoElement.srcObject = mediaStream
        // todo: consider waiting for metadata loading
        // todo: consider separating "play" from "useStream"
        videoElement.play()
    },

    // todo: inspect, may not be the proper way to off stream
    offStream(videoElement: HTMLVideoElement) {
        videoElement.pause()
        videoElement.srcObject = null
    },
}
