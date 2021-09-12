const { authenticate } = require('./login/authenticate')
const {
    isUserExist,
} = require('../../middlewares/registrationMiddlewares/isUserExist.middleware')
const { Router } = require('express')
const { register } = require('./registration/register')
const { isUsernameExist } = require('./registration/isUsernameExist')
const { routes } = require('../../app-constants/routes')
const { registerValidators } = require('../../utils/validators')

const authRouter = Router()

authRouter.post(
    routes.auth.registr,
    ...registerValidators,
    isUserExist,
    register
)
authRouter.post(routes.auth.isUserExist, isUserExist)
authRouter.post(routes.auth.authenticate, authenticate)

module.exports = {
    authRouter,
}
