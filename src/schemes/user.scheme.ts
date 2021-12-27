import { Schema } from 'mongoose'

export type User = {
    username: string
    password: string
}

export const userSchema = new Schema<User>({
    username: { type: String, required: true, maxLength: 16, minLength: 4 },
    password: { type: String, required: true },
})
