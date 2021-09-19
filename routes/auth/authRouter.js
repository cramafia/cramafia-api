const { authResponses } = require('../../app-constants/responses')
const { authenticate } = require('./login/authenticate')
const {
    isUserExist,
} = require('../../middlewares/registrationMiddlewares/isUserExist.middleware')
const { Router } = require('express')
const { register } = require('./registration/register')
const { routes } = require('../../app-constants/routes')
const { registerValidators } = require('../../utils/validators')

const authRouter = new Router()

authRouter.post(
    routes.auth.registr,
    ...registerValidators,
    isUserExist,
    register,
)
authRouter.post(routes.auth.isUserExist, isUserExist, (req, res) =>
    res.status(200).json(authResponses.isUserExist.notExist),
)
authRouter.post(routes.auth.authenticate, authenticate)

module.exports = {
    authRouter,
}
