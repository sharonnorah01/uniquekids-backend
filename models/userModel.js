const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        reuired: true,
        minlength: 6
    },
    displayName: {
        type: String
    }
})

const User = mongoose.model('users', userSchema) //creating the user model

module.exports = User

