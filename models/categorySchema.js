const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subCategory: {
        type: [String],
        required: true
    },
})

module.exports.category = mongoose.model('category', categorySchema);