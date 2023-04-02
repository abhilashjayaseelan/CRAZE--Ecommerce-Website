const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const addressSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    locality: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

module.exports.address = mongoose.model('address', addressSchema);