const { authResponses } = require('../../../app-constants/responses')

const isUsernameExist = async (req, res) =>
    res.status(200).json(authResponses.isUserExist.notExist)

module.exports = {
    isUsernameExist,
}
