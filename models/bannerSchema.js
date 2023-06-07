const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema({
        title: {
            type: String
        },
        image: {
            type: String
        },
        mainDescription: {
            type: String
        },
        subDescription: {
            type: String
        },
        categoryOffer: {
            type: String
        },
        createdAt: {
            type: Date,
            default: new Date()
        },
        updatedAt: {
            type: Date
        }
})

module.exports = {
    Banner : mongoose.model('banner',bannerSchema)
}