const { response } = require('../app');
const cartHelper = require('../helpers/cart-helpers');
const userProfileHelpers = require('../helpers/user-profile-helpers');
const ObjectId = require('mongodb').ObjectId
const razorPay = require('../api/razorPay');

module.exports = {
    // add to cart
    addToCart: (req, res) => {
        const user = req.session.user.response._id;
        const productId = req.params.id
        cartHelper.toCart(productId, user).then((data) => {
            if (data) {
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
        })
    },
    // get cart items
    getCart: (req, res) => {
        const user = req.session.user;
        cartHelper.getCartItems(user.response._id).then((data) => {
            let products = JSON.parse(JSON.stringify(data))
            cartHelper.cartTotal(user.response._id).then((total) => {

                res.render('user/user-cart', { user, products, total, itsUser: true });
 
            })
        })
    },
    // change the product quantity
    changeProductQuantity: (req, res, next) => {
        cartHelper.changeQuantity(req.body).then((quantity) => {
            cartHelper.cartTotal(req.body.user).then((total) => {
                res.json({ status: quantity, total })
            })
        })
    },
    // delete the product
    deleteProduct: (req, res) => {
        const userId = req.session.user.response._id;
        const productId = req.params.id
        cartHelper.removeProduct(userId, productId).then(() => {
            res.json({ status: true })
        })
            .catch((error) => {
                console.log(error);
            })
    },
    // get checkout page
    getCheckout: (req, res) =>{
        const user = req.session.user;
        // console.log(user.response._id);
        cartHelper.getCartItems(user.response._id).then((data) => {
            const products = JSON.parse(JSON.stringify(data))
            cartHelper.cartTotal(user.response._id).then((total) => {
                userProfileHelpers.getAddress(user.response._id).then((result)=>{
                    const address = JSON.parse(JSON.stringify(result))
                    res.render('user/checkout', { user, products, total, address, itsUser: true });
                })
 
            })
        })

    },
    // place order
    placeOrder: async(req, res) => {
        // console.log(req.body.userId);
        let products = await cartHelper.getCartProductList(req.body.userId);
        let totalPrice = await cartHelper.cartTotal(req.body.userId);
        // console.log(products, totalPrice +"hai");
        cartHelper.placeOrder(req.body, products, totalPrice).then((response) =>{
            if(req.body['payment_option'] == 'COD') {
                res.json({status: 'cod'});
            } else if(req.body['payment_option'] == 'Razorpay'){
                razorPay.generateRazorpay(response.orderId, response.totalPrice).then((order) =>{
                    res.json({response, order, status: 'razorpay'});
                })
            }
        })  
    }
}   