import mongoose from 'mongoose'
import { userSchema } from 'src/schemes/user.scheme'

export const UserModel = mongoose.model('users', userSchema)
