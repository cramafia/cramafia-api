const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { UserModel } = require("../../../models/user.model")

const authenticate = async(req, res) => {
    try {
        const  { username, password } = req.body

        const user = await UserModel.findOne({ username })

        if (!user) {
             return res.status(400).json({ message: 'Username or password is incorrect' })
        }

        const isPasswordsEqual = await bcrypt.compare(password, user.password)

        if (!isPasswordsEqual) {
            return res.status(400).json({ message: 'Username or password is incorrect' })
        }

        const token = jwt.sign({ ...user }, process.env.JWT_SECRET)

        return res.status(200).json({ message: 'Success!', token })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = {
    authenticate,
}