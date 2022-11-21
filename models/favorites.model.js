const mongoose = require('mongoose')

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const favoritesModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: pointSchema,
        required: true
    },
    barangay: {
        type: String,
        required: true
    },
    classification: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId, ref: 'Users'
    }
}, { timestamps: true, collection: 'Favorites', toJSON: { getters: true } })




module.exports = mongoose.model('Favorites', favoritesModel)