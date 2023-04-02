const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discountSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String
    },
    discountPercentage: {
        type: Number,
        min: 0,
        max: 100
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports.discount = mongoose.model('discount', discountSchema);