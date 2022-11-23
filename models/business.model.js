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

const businessModel = new mongoose.Schema({
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
    },
    id: false
}, { timestamps: true, collection: 'Business' })

businessModel.index({ location: '2dsphere' })
businessModel.index({ name: 'text', address: 'text', barangay: 'text', classification: 'text' })

function getDoubleValue(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(value.toString());
    }
    return value;
};

module.exports = mongoose.model('Business', businessModel)