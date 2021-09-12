const { body } = require('express-validator')

const registerValidators = [
    body('username').isLength({ min: 4, max: 16 }),
    body('password').isLength({ min: 8, max: 32 }),
]

module.exports = {
    registerValidators,
}