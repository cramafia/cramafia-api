const { authenticate } = require('./login/authenticate')
const {
    isUserExist,
} = require('../../middlewares/registrationMiddlewares/isUserExist.middleware')
const { Router } = require('express')
const { register } = require('./registration/register')

const authRouter = Router()

authRouter.post('/register', isUserExist, register)
authRouter.post('/checkUsername', isUserExist)
authRouter.post('/authenticate', authenticate)

module.exports = {
    authRouter,
}
