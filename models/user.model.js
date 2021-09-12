const mongoose = require('mongoose')
const { userSchema } = require('../schemes/user.scheme')

const UserModel = mongoose.model('users', userSchema)

module.exports = {
    UserModel,
}
