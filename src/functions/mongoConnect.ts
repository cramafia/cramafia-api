import mongoose from 'mongoose'

export const connectDB = async (url: string) => {
    try {
        await mongoose.connect(url)
    } catch (e) {
        throw e
    }
}
