const cartHelper = require('../helpers/cart-helpers');
const userProfileHelpers = require('../helpers/user-profile-helpers');
const ObjectId = require('mongodb').ObjectId


module.exports = {
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
    getCart: (req, res) => {
        const user = req.session.user;
        cartHelper.getCartItems(user.response._id).then((data) => {
            let products = JSON.parse(JSON.stringify(data))
            cartHelper.cartTotal(user.response._id).then((total) => {

                res.render('user/user-cart', { user, products, total, itsUser: true });
 
            })
        })
    },
    changeProductQuantity: (req, res, next) => {
        cartHelper.changeQuantity(req.body).then((quantity) => {
            cartHelper.cartTotal(req.body.user).then((total) => {
                res.json({ status: quantity, total })
            })
        })
    },
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
        cartHelper.getCartItems(user.response._id).then((data) => {
            const products = JSON.parse(JSON.stringify(data))
            cartHelper.cartTotal(user.response._id).then((total) => {
                userProfileHelpers.getAddress(user.response._id).then((result)=>{
                    const address = JSON.parse(JSON.stringify(result))
                    console.log(address);
                    res.render('user/checkout', { user, products, total, address, itsUser: true });
                })
 
            })
        })

    }


}