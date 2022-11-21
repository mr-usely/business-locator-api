const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    birthDay: {
        type: Date,
        require: true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true, collection: 'Users' })

module.exports = mongoose.model('Users', userModel)