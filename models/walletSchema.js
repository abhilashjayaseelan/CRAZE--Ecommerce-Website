const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    transactions: {
        type: [Object],
        default: []
    }
})

module.exports.wallet = mongoose.model('wallet', walletSchema);