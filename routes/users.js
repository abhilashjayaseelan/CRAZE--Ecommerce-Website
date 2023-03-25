const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user-controller')
const productControllers = require('../controllers/product-controller')
const sessionHandler = require('../middlewares/session-handling');
const profileControllers = require('../controllers/user-profile-controller');
const userProfileController = require('../controllers/user-profile-controller');
const cartController = require('../controllers/cart-controllers');
const sessionHandling = require('../middlewares/session-handling');

// user home page
router.get('/', userControllers.getHomePage);

// category wise filter
router.get('/category-wise-filter',
    productControllers.categoryWise);

// user login & logout 
router.route('/login')
    .get(userControllers.getLogin)
    .post(userControllers.postLogin);

router.get('/logout', userControllers.userLogout);

// user otp login
router.route('/otp-login')
    .get(userControllers.getOtpLogin)
    .post(userControllers.postOtpLogin);

// otp verification
router.route('/otp-varification')
    .get(userControllers.getOtpVarification)
    .post(userControllers.postOtpVarification);

// user signup
router.route('/signup')
    .get(userControllers.getSignup)
    .post(userControllers.postSignup);

// product view  
router.get('/view-products',
    userControllers.getHomePage);

// single product view
router.get('/view-singleProduct/:id',
    productControllers.getProduct);

// getting the user profile page
router.get('/profile',
    sessionHandler.checkingUser,
    profileControllers.getProfile);

// add address  
router.route('/add-address')
    .get(sessionHandler.checkingUser,
        userProfileController.getAddress)
    .post(userProfileController.postAddress);

// delete address
router.get('/delete-address/:id',
    sessionHandler.checkingUser,
    profileControllers.deleteAddress)

// change password 
router.route('/change-password')
    .get(sessionHandler.checkingUser,
        profileControllers.getPassword)
    .post(profileControllers.putPassword);

// add to cart
router.get('/add-to-cart/:id',
    sessionHandler.checkingUser,
    cartController.addToCart);

// get cart
router.get('/user-cart',
    sessionHandler.checkingUser,
    cartController.getCart);

// changing product quantity in cart
router.post('/change-quantity',
    sessionHandler.checkingUser,
    cartController.changeProductQuantity);

// delete product in 
router.get('/delete-from-cart/:id',
    sessionHandler.checkingUser,
    cartController.deleteProduct);

// get checkout page
router.get('/checkout',
    sessionHandler.checkingUser,
    cartController.getCheckout);

// place order
router.post('/place-order',
    cartController.placeOrder);

// verify payment
router.post('/verify-payment',
    userControllers.verifyPayment);

// go to the order page
router.get('/orders',
    sessionHandling.checkingUser,
    userControllers.showOrders);

// view order details
router.get('/order-details',
    sessionHandling.checkingUser,
    userControllers.orderDetails);

// cancel order
router.post('/cancel-order',
    userControllers.cancelOrder);

// return order
router.post('/return-order',
    userControllers.returnOrder);

// edit profile
router.route('/edit-profile/:id')
    .get(sessionHandler.checkingUser,
        profileControllers.editProfile)
    .post(profileControllers.postEditProfile);

// add to wish-list
router.get('/add-wishlist',
    sessionHandler.checkingUser,
    userControllers.addToWishlist);

// go to wish-list 
router.get('/wishlist',
    sessionHandler.checkingUser,
    userControllers.showWishlist);

// remove product from wish-list
router.get('/remove-from-wishlist',
    sessionHandler.checkingUser,
    userControllers.removeWish);

// user wallet
router.get('/user-wallet',
    sessionHandler.checkingUser,
    userControllers.getWallet);

// coupon page
router.get('/my-coupons',
    sessionHandler.checkingUser,
    userProfileController.getCoupons);

// applying coupon
router.post('/apply-coupon',
    sessionHandler.checkingUser,
    userControllers.applyCoupon);


module.exports = router;  
