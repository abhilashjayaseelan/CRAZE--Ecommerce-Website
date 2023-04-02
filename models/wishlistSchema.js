const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const wishlistSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    products: {
        type: Array,
        required: true
    }
})

module.exports.wishlist = mongoose.model('wishlist', wishlistSchema);