const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        
        
    },
    password: {
        type: String,

        
    },
    email: {
        type: String,
        
        
    },
    mobile: {
        type: Number,
        
        
    },
    createdAt: {
        type : Date,
        default : new Date()
    },
    status:{
        type:Boolean,
        default : true
    }
})

module.exports = {
    user: mongoose.model("user", userSchema)
}