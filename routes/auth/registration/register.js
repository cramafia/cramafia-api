const bcrypt = require('bcrypt')
const { salt } = require('../../../app-constants/constants')
const { UserController } = require('../../../controllers/user.controller')
const { authResponses } = require('../../../app-constants/responses')
const { validationResult } = require('express-validator')

const register = async (req, res) => {
    try {
        const { username, password } = req.body
        const errors = validationResult(req)

        console.log(errors)

        if (!errors.isEmpty()) {
            return res.status(400).json(authResponses.registration.incorrectData)
        }

        const encodedPassword = await bcrypt.hash(password, salt)

        await UserController.create({ username, password: encodedPassword })

        res.status(200).json(authResponses.registration.success)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = {
    register,
}
