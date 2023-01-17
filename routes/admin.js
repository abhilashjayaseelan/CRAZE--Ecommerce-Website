const express = require('express');
const { response } = require('../app');
const router = express.Router();
const adminController = require('../controllers/admin-controller');
const productController = require('../controllers/product-controller');
const categoryController = require('../controllers/category-controller');
const adminHelper = require('../helpers/admin-helpers');
const sessionHandler = require('../middlewares/session-handling');

// home
router.get('/', 
    sessionHandler.checkingAdmin, 
    adminController.adminDashboard);

// Admin login and logut
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

// router.get('/edit-productCategory/:id', adminController.editProductCategory);

// router.patch('/edit-productCategory/:id', adminController.editProductCategory);

// router.get('/delete-productCategory/:id, adminController.deleteProductCategory);


// Product handling
router.get('/view-products', 
    sessionHandler.checkingAdmin, 
    productController.viewProducts);

// add prioduct
router.route('/add-product')
    .get(sessionHandler.checkingAdmin, 
        productController.getAddProduct)
    .post(productController.postAddProduct);

// edit product
router.route('/edit-product/:id')
    .get(sessionHandler.checkingAdmin, 
        productController.getEditProduct)
    .post(productController.postEditProduct);

// delete procuct
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

module.exports = router;
