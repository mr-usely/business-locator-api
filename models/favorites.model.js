const mongoose = require('mongoose')

const favoritesModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lat: {
        type: mongoose.Types.Decimal128,
        required: true,
        get: getDoubleValue
    },
    lng: {
        type: mongoose.Types.Decimal128,
        require: true,
        get: getDoubleValue
    },
    classification: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId, ref: 'Users'
    }
}, { timestamps: true, collection: 'Favorites', toJSON: { getters: true } })

function getDoubleValue(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(value.toString());
    }
    return value;
};

module.exports = mongoose.model('Favorites', favoritesModel)