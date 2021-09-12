const { UserController } = require('../../controllers/user.controller')
const { authResponses } = require('../../app-constants/responses')

const isUserExist = async (req, res, next) => {
    try {
        if (await UserController.isExist(req.body.username)) {
            return res.status(400).json(authResponses.isUserExist.exist)
        }

        next()
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = {
    isUserExist,
}
