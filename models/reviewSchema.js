const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports.review = mongoose.model('productReviewSchema', productReviewSchema);
