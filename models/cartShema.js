const mongoose = require("mongoose")
const cartSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    cartItems: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
            quantity: { type: Number, default: 1 },
            price: { type: Number },
        },
    ],

})

module.exports = {
    Cart : mongoose.model('cart',cartSchema)
}