const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ordersSchema = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    deliveryAddress: {
        type: Object,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    products: {
        type: Object,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    orderStatus: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    }
})

module.exports.orders = mongoose.model('orders', ordersSchema);