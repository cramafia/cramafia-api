const { Schema } = require('mongoose')

const userSchema = new Schema({
    username: { type: String, required: true, maxLength: 16, minLength: 4 },
    password: { type: String, required: true },
})

module.exports = {
    userSchema,
}