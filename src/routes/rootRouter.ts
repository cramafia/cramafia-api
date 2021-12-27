import { Router } from 'express'
import { authRouter } from './auth/authRouter'

const rootRouter = Router()

rootRouter.use('/auth', authRouter)

export { rootRouter }
