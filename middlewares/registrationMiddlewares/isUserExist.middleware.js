const { UserModel } = require('../../models/user.model')

const isUserExist = async (req, res, next) => {
    try {
        const sameUser = await UserModel.findOne({
            username: req.body.username,
        })

        if (sameUser) {
            return res
                .status(400)
                .json({ message: 'User with the same username already exist' })
        }

        next()
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = {
    isUserExist,
}
