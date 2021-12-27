import { UserModel } from 'models/user.model'
import { User } from 'schemes/user.scheme'

export class UserController {
    static async isExist(username: string) {
        try {
            return !!(await UserModel.findOne({ username }))
        } catch (e) {
            throw e
        }
    }

    static async create(user: User) {
        try {
            await (await UserModel.create({ ...user })).save()
        } catch (e) {
            throw e
        }
    }

    static async findUserByUsername(username: string) {
        try {
            return await UserModel.findOne({ username })
        } catch (e) {
            throw e
        }
    }

    static async authorizeUser(user: User) {
        try {
            return await UserModel.findOne({ ...user })
        } catch (e) {
            throw e
        }
    }
}
