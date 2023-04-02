const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const couponTemplateSchema = new mongoose.Schema({
    discountPercentage: {
        type: Number,
        required: false,
        min: 0,
        max: 100,
    },
    maxDiscountAmount: {
        type: Number,
        required: false,
        min: 0,
    },
    minAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    }
});

module.exports.couponTemplateSchema = mongoose.model('couponTemplateSchema', couponTemplateSchema);

