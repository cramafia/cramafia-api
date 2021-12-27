import { NextFunction, Request, Response } from 'express'
import { authResponses } from 'src/app-constants/responses'
import { UserController } from 'src/controllers/user.controller'

export const isUserExist = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (await UserController.isExist(req.body.username)) {
            return res.status(400).json(authResponses.isUserExist.exist)
        }

        next()
    } catch (e: any) {
        res.status(500).json({ message: e.message })
    }
}
