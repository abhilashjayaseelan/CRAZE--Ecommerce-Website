const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controller');
const productController = require('../controllers/product-controller');
const categoryController = require('../controllers/category-controller');
const adminHelper = require('../helpers/admin-helpers');
const sessionHandler = require('../middlewares/session-handling');
const upload = require("../middlewares/multer-cloudinary");

// home
router.get('/',
    sessionHandler.checkingAdmin,
    adminController.adminDashboard);

// Admin login and logout
router.route('/admin-login')
    .get(sessionHandler.adminAuthenticationCheck,
        adminController.getAdminLogin)
    .post(adminController.postAdminLogin);

router.get('/admin-logout',
    adminController.getAdminLogout);

// dash board
router.get('/dashboard',
    sessionHandler.checkingAdmin,
    adminController.adminDashboard);

// Product Category handling 
router.route('/add-productCategory')
    .get(sessionHandler.checkingAdmin,
        categoryController.getProductCategory)
    .post(categoryController.addProductCategory);

// get subcategories for adding product
router.post('/get-subcategories',
    categoryController.getSubCategories);

// router.get('/edit-productCategory/:id', adminController.editProductCategory);

// router.patch('/edit-productCategory/:id', adminController.editProductCategory);

// router.get('/delete-productCategory/:id, adminController.deleteProductCategory);


// Product handling
router.get('/view-products',
    sessionHandler.checkingAdmin,
    productController.viewProducts);

// add product
router.route('/add-product')
    .get(sessionHandler.checkingAdmin,
        productController.getAddProduct)
    .post(upload,productController.postAddProduct);

// edit product
router.route('/edit-product/:id')
    .get(sessionHandler.checkingAdmin,
        productController.getEditProduct)
    .post(productController.postEditProduct);

// delete product
router.get('/delete-product/:id',
    productController.getDeleteProduct);

// User handling...
router.get('/view-users',
    sessionHandler.checkingAdmin,
    adminController.viewUsers);

// block user
router.patch('/block-user/:id', (req, res) => {
    adminHelper.blockUser(req.params.id).then((response) => {
        res.send(response);
    })
});

// unblock user
router.patch('/unblock-user/:id', (req, res) => {
    adminHelper.unblockUser(req.params.id).then((response) => {
        res.send('user unblocked');
    })
})

// user orders
router.get('/user-orders',
    sessionHandler.checkingAdmin,
    adminController.getuserOrders);

// order details
router.get('/user-orderDetails/:id',  
    sessionHandler.checkingAdmin,
    adminController.getOrderDetails);

// search order
router.post('/search-order',
    sessionHandler.checkingAdmin,
    adminController.searchOrders);

// change order status
router.post('/change-status',  
    adminController.changeOrderStatus);

// offers
router.route('/offers')
    .get(sessionHandler.checkingAdmin,
        productController.getOffers)
    .post(sessionHandler.checkingAdmin,
        productController.postOffer);

// creating report 
router.post('/create-report',
    adminController.makeReport); 

// creating coupons
router.route('/coupons')
    .get(sessionHandler.checkingAdmin,
        adminController.getCoupon)
    .post(adminController.postCoupon);   

module.exports = router;
