const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { UserController } = require('../../../controllers/user.controller')
const { authResponses } = require('../../../app-constants/responses')

const authenticate = async(req, res) => {
    try {
        const  { username, password } = req.body

        const user = await UserController.findUserByUsername(username)

        if (!user) {
             return res.status(400).json(authResponses.login.incorrectData)
        }

        const isPasswordsEqual = await bcrypt.compare(password, user.password)

        if (!isPasswordsEqual) {
            return res.status(400).json(authResponses.login.incorrectData)
        }

        const token = jwt.sign({ ...user }, process.env.JWT_SECRET)

        return res.status(200).json({ ...authResponses.login.success, token })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = {
    authenticate,
}