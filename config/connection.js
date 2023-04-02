const mongoose = require('mongoose');
const mongoDB = process.env.mongodb_connection;

const connection = mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('connected to database');
    })
    .catch((err) => {
        console.log(err);
    });

const user = require('../models/userSchema').user;
const products = require('../models/productSchema').products;
const category = require('../models/categorySchema').category;
const discount = require('../models/discountSchema').discount;
const address = require('../models/addressSchema').address;
const cart = require('../models/cartSchema').cart;
const orders = require('../models/ordersSchema').orders;
const wishlist = require('../models/wishlistSchema').wishlist
const wallet = require('../models/walletSchema').wallet;
const couponTemplateSchema = require('../models/couponTemplateSchema').couponTemplateSchema;
const userCouponSchema = require('../models/userCouponSchema').userCouponSchema;
const review = require('../models/reviewSchema').review;

module.exports = {
    connection,
    user,
    products,
    category,
    discount,
    address,
    cart,
    orders,
    wishlist,
    wallet,
    couponTemplateSchema,
    userCouponSchema,
    review
}

