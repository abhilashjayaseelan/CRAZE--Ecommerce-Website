const express = require('express');
const userController = require('../controllers/user-controller');
const router = express.Router();
const userControllers = require('../controllers/user-controller')
const productControllers = require('../controllers/product-controller')
const sessionHandler = require('../middlewares/session-handling');
const profileControllers = require('../controllers/user-profile-controller');
const userProfileController = require('../controllers/user-profile-controller');
const cartController = require('../controllers/cart-controllers');

// user home page
router.get('/', userController.getHomePage);

// user login & logout
router.route('/login')
    .get( userControllers.getLogin)
    .post(userControllers.postLogin);

router.get('/logout', userControllers.userLogout);

// user otp login
router.route('/otp-login')
    .get(userControllers.getOtpLogin)
    .post(userControllers.postOtpLogin);

// otp varification
router.route('/otp-varification')
    .get(userControllers.getOtpVarification)
    .post(userController.postOtpVarification);   

// user signup
router.route('/signup')
    .get( userControllers.getSignup)
    .post( userControllers.postSignup);
  
// product view
router.get('/view-products', 
    userControllers.getHomePage);

// sigle product view
router.get('/view-sigleProduct/:id', 
    productControllers.getProduct);

// getting the user profile page
router.get('/profile/:id',
    sessionHandler.checkingUser, 
    profileControllers.getProfile);
 
// add address  
router.route('/add-address') 
    .get(sessionHandler.checkingUser, 
        userProfileController.getAddress)
    .post( userProfileController.postAddress);

// delete address
router.get('/delete-address/:id',
    sessionHandler.checkingUser,
    profileControllers.deleteAddress)

// change password 
router.route('/change-password')
    .get( sessionHandler.checkingUser, 
        profileControllers.getPassword)
    .post( profileControllers.postPassword);

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


// router.get('/orders', userControllers.showOrders); 
  
// router.get('/wishlist', userControllers.showWishlist);


module.exports = router;
