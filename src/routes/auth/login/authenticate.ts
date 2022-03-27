import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authResponses, generalError } from 'app-constants/responses'
import { UserController } from 'controllers/user.controller'

export const authenticate = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body

        const user = await UserController.findUserByUsername(username)

        if (!user) {
            return res.status(400).json(authResponses.login.incorrectData)
        }

        const isPasswordsEqual = await bcrypt.compare(password, user.password)

        if (!isPasswordsEqual) {
            return res.status(400).json(authResponses.login.incorrectData)
        }

        const token = jwt.sign({ ...user }, process.env.JWT_SECRET || '')

        return res.status(200).json({ ...authResponses.login.success, token })
    } catch (e) {
        res.status(500).json({ message: generalError })
    }
}