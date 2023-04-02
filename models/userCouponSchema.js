const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userCouponSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    couponTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CouponTemplate',
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    used: {
        type: Boolean,
        default: false,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
    },
    minAmount: {
        type: Number,
        required: false
    },
    maxDiscountAmount: {
        type: Number,
        required: false
    },
    discountPercentage: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    }
});

module.exports.userCouponSchema = mongoose.model('userCouponSchema', userCouponSchema);