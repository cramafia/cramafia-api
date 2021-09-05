const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    username: { type: String, required: true, max: 16, min: 4 },
    password: { type: String, required: true, max: 32, min: 8 },
})

const UserModel = mongoose.model('users', userSchema)

module.exports = {
    UserModel,
}
