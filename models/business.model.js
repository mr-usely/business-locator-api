const mongoose = require('mongoose')

const businessModel = new mongoose.Schema({
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
}, { timestamps: true, collection: 'Business', toJSON: { getters: true } })

function getDoubleValue(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(value.toString());
    }
    return value;
};

module.exports = mongoose.model('Business', businessModel)