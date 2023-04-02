const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    products: {
        type: Array,
        required: true
    }

})

module.exports.cart = mongoose.model('cart', cartSchema);