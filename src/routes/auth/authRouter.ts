import { Request, Response, Router } from 'express'
import { authResponses } from 'app-constants/responses'
import { routes } from 'app-constants/routes'
import { isUserExist } from 'middlewares/registrationMiddlewares/isUserExist.middleware'
import { registerValidators } from 'utils/validators'
import { authenticate } from './login/authenticate'
import { register } from './registration/register'

const authRouter = Router()

authRouter.post(
    routes.auth.registr,
    ...registerValidators,
    isUserExist,
    register,
)
authRouter.post(
    routes.auth.isUserExist,
    isUserExist,
    (_: Request, res: Response) =>
        res.status(200).json(authResponses.isUserExist.notExist),
)
authRouter.post(routes.auth.authenticate, authenticate)

export { authRouter }
