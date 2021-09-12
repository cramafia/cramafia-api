const { UserModel } = require('../models/user.model')

class UserController {
    static async isExist(username) {
        try {
            return !!(await UserModel.findOne({ username }))
        } catch (e) {
            throw e
        }
    }

    static async create(user) {
        try {
            await (await UserModel.create({ ...user })).save()
        } catch (e) {
            throw e
        }
    }

    static async findUserByUsername(username) {
        try {
            return await UserModel.findOne({ username })
        } catch (e) {
            throw e
        }
    }

    static async authorizeUser(user) {
        try {
            return await UserModel.findOne({ ...user })
        } catch (e) {
            throw e
        }
    }
}

module.exports = {
    UserController,
}
