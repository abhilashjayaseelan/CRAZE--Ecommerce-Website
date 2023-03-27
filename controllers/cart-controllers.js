const cartHelper = require('../helpers/cart-helpers');
const userProfileHelpers = require('../helpers/user-profile-helpers');
const userHelper = require('../helpers/user-helpers');
const ObjectId = require('mongodb').ObjectId
const razorPay = require('../api/razorPay');

module.exports = {
    // add to cart
    addToCart: async (req, res) => {
        try {
            const user = req.session.user.response._id;
            const productId = req.params.id;
            const data = await cartHelper.toCart(productId, user);
            if (data) {
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
        } catch (error) {
            console.log(error);
            res.json({ status: false });
        }
    },
    // get cart items
    getCart: async (req, res) => {
        try {
            const { response: { _id } } = req.session.user;
            const products = await cartHelper.getCartItems(_id);
            const total = await cartHelper.cartTotal(_id);
            const count = await cartHelper.productCount(_id);
            req.session.cartItems = products;
            req.session.cartTotal = total;
            res.render('user/user-cart', { user: req.session.user, products, total, itsUser: true, count });
        } catch (error) {
            console.log('error while getting cart items: ' + error);
            res.redirect('/');
        }
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
    getCheckout: async (req, res) => {
        try {
            const { _id: userId } = req.session.user.response;
            const { discountPrice, afterDiscount } = req.session;

            const [cartItems, cartTotal, userAddress, count] = await Promise.all([
                cartHelper.getCartItems(userId),
                cartHelper.cartTotal(userId),
                userProfileHelpers.getAddress(userId),
                cartHelper.productCount(userId)
            ]);

            const products = JSON.parse(JSON.stringify(cartItems));
            const total = JSON.parse(JSON.stringify(cartTotal));
            const address = JSON.parse(JSON.stringify(userAddress));

            res.render('user/checkout', {
                discountPrice,
                afterDiscount,
                user: req.session.user,
                products,
                total,
                address,
                itsUser: true,
                count
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    // place order
    placeOrder: async (req, res) => {
        let products = await cartHelper.getCartProductList(req.body.userId);
        let totalPrice = await cartHelper.cartTotal(req.body.userId);
        const { afterDiscount } = req.session;
        if (afterDiscount) {
            totalPrice = afterDiscount;
        }
        cartHelper.placeOrder(req.body, products, totalPrice).then((response) => {
            // generating coupon if the conditions met
            const coupon = userHelper.generateCoupon(response.totalPrice, response.products, req.body.userId);
            console.log("hai");
            if (req.body['payment_option'] == 'COD') {
                res.json({ coupon, status: 'cod' });
            } else if (req.body['payment_option'] == 'Razorpay') {
                razorPay.generateRazorpay(response.orderId, response.totalPrice).then((order) => {
                    res.json({ coupon, response, order, status: 'razorpay' });
                })
            }
        })

        // changing the coupon status if a coupon is applied
        if (afterDiscount) {
            const { couponCode } = req.session;
            userHelper.changeCouponStatus(couponCode).then(() => {
                req.session.discountPrice = false;
                req.session.afterDiscount = false;
                req.session.couponCode = false;
            })
        }
    }
}   