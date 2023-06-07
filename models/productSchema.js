const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    brand: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    category: {
        type: String
    },
    sub_category: {
        type: String
    },
    discountedPrice: {
        type: Number,
        default: 0
    },
    img: {
        type: Array
    },
    unlist: {
        type: Boolean,
        default : true
    },
    
})

module.exports = {
    Product: mongoose.model('product', productSchema)
}