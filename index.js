require('dotenv').config()

const http = require('http')
const express = require('express')

const { rootRouter } = require('./routes/rootRouter')
const { connectDB } = require('./functions/mongoConnect')
const { SocketController } = require('./controllers/socket.controller')
const eventListeners = require('./socket/eventHandlers')

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
    Socket
}
