const bcrypt = require('bcrypt')
const { salt } = require('../../../app-constants/constants')
const { UserModel } = require('../../../models/user.model')

const register = async (req, res) => {
    try {
        const { username, password } = req.body
        const encodedPassword = await bcrypt.hash(password, salt)

        const userDoc = new UserModel({
            username,
            password: encodedPassword,
        })
        await userDoc.save()

        res.status(200).json({ message: 'User successfully created' })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = {
    register,
}
