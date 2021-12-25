const mongoose = require('mongoose')

const connectDB = async (url) => {
    try {
        await mongoose.connect(url)
    } catch (e) {
        throw e
    }
}
module.exports = {
    connectDB,
}
