const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    blocked: {
        type: Boolean,
        default: false
    },
    coupons: [{
        coupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon',
            required: true,
        },
        used: {
            type: Boolean,
            default: false,
        },
        dateUsed: {
            type: Date,
        },
    }],
})

module.exports.user = mongoose.model('user', userSchema);