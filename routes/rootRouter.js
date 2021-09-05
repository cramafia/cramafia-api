const { authRouter } = require('./auth/authRouter')
const { Router } = require('express')

const rootRouter = Router()

rootRouter.use('/auth', authRouter)

module.exports = {
    rootRouter,
}
