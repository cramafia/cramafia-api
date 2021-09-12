const dotenv = require('dotenv')
dotenv.config()
const { connectDB } = require('./functions/mongoConnect')
const express = require('express')
const { rootRouter } = require('./routes/rootRouter')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api', rootRouter)

app.listen(port, async () => {
    try {
        await connectDB(process.env.DB_CONNECTION_URL)
        console.log(`Server listening at http://localhost:${port}`)
    } catch (e) {
        throw e
    }
})
