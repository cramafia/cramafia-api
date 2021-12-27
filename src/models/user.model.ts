import mongoose from 'mongoose'
import { userSchema } from 'schemes/user.scheme'
import { User } from 'schemes/user.scheme'

export const UserModel = mongoose.model<User>('users', userSchema)
