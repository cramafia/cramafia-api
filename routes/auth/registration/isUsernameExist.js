const { authResponses } = require('../../../app-constants/responses')

const isUsernameExist = async (req, res) => {
    try {
        res.status(200).json(authResponses.isUserExist.notExist)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = {
    isUsernameExist,
}