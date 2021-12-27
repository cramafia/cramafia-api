import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import { salt } from 'app-constants/constants'
import { authResponses, generalError } from 'app-constants/responses'
import { UserController } from 'controllers/user.controller'

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const errors = validationResult(req)

        console.log(errors)

        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json(authResponses.registration.incorrectData)
        }

        const encodedPassword = await bcrypt.hash(password, salt)

        await UserController.create({ username, password: encodedPassword })

        res.status(200).json(authResponses.registration.success)
    } catch (e) {
        res.status(500).json({ message: generalError })
    }
}
