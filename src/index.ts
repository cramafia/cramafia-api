require('dotenv').config()

import http from 'http'
import express from 'express'

import { rootRouter } from './routes/rootRouter'
import { connectDB } from './functions/mongoConnect'
import { SocketController } from './controllers/socket.controller'
import eventListeners from './socket/eventHandlers'

const app = express()
const server = http.createServer(app)
const Socket = new SocketController(server)

const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api', rootRouter)

Socket.addEventListeners(eventListeners)

app.get('/', (req, res) => res.send('mafia public api staging'))

server.listen(port.toString(), async () => {
    try {
        await connectDB(process.env.DB_CONNECTION_URL)
        console.log(`Server listening at http://localhost:${port}`)
    } catch (e) {
        throw e
    }
})

module.exports = {
    Socket,
}
