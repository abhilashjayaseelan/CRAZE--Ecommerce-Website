const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    slug: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    name: {
        type: String,
        require: true
    },
    brand: {
        type: String,
        require: true
    },
    color: {
        type: String,
        require: true
    },
    size: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    images: {
        type: Object,
        required: true
    },
    totalQty: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: false
    },
    discountedPrice: {
        type: Number,
        default: 0,
        required: false
    },
    discountTil: {
        type: Date,
        required: false 
    }
})

module.exports.products = mongoose.model('products', productSchema);