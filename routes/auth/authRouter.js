const { authenticate } = require('./login/authenticate')
const {
    isUserExist,
} = require('../../middlewares/registrationMiddlewares/isUserExist.middleware')
const { Router } = require('express')
const { register } = require('./registration/register')
const { isUsernameExist } = require('./registration/isUsernameExist')
const { routes } = require('../../app-constants/routes')
const { registerValidations } = require('../../utils/validations')

const authRouter = Router()

authRouter.post(routes.auth.registr, ...registerValidations, isUserExist, register)
authRouter.post(routes.auth.isUserExist, isUserExist, isUsernameExist)
authRouter.post(routes.auth.authenticate, authenticate)

module.exports = {
    authRouter,
}
