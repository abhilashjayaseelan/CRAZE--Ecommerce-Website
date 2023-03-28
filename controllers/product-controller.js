const productHelpers = require("../helpers/product-helpers");
const cartHelpers = require("../helpers/cart-helpers");

module.exports = {
    // user side 
    getProduct: async (req, res) => {
        try {
            const slug = req.params.id;
            const user = req.session.user;
            const count = user ? await cartHelpers.productCount(user.response._id) : 0;
            const product = JSON.parse(JSON.stringify(await productHelpers.getProduct(slug)));
            res.render('user/single-product', { user, product, itsUser: true, count });
        } catch (err) {
            console.error(err);
            res.render('error', { message: 'Error getting product', error: err });
        }
    },
    // filtering products based on categories
    categoryWise: async (req, res) => {
        try {
            const category = req.query.category;
            const user = req.session.user;
            const count = user ? await cartHelpers.productCount(user.response._id) : 0;
            const result = await productHelpers.categoryFilter(category);
            const products = JSON.parse(JSON.stringify(result));
            let filter = products[0].category;
            res.render('user/category-wise', { itsUser: true, user, products, filter, count })

        } catch (err) {
            console.log(err);
            res.status(500).send('internal error');
        }
    },

    // admin side
    // view products
    viewProducts: (req, res) => {
        productHelpers.getProducts().then((product) => {
            let products = JSON.parse(JSON.stringify(product));
            res.render('admin/admin-products', { admin: true, products });
        })
    },
    // product adding 
    getAddProduct: (req, res) => {
        res.render('admin/add-products', { admin: true, 'addProductSuccess': req.session.addProductSuccess });
        req.session.addProductSuccess = false;
    },
    postAddProduct: async (req, res) => {
        try {
            const images = req.files.map(file => file.path);
            // console.log(images);
            await productHelpers.addProduct(req.body, images);
            req.session.addProductSuccess = "Product added successfully";
            req.session.addProductStatus = true;
        } catch (error) {
            console.error(error);
            req.session.addProductStatus = false;
        } finally {
            res.redirect('/admin/add-product');
        }
    },
    // edit and delete product
    getEditProduct: (req, res) => {
        productHelpers.getEditProduct(req.params.id).then((products) => {
            let data = JSON.parse(JSON.stringify(products))
            // console.log(data);
            res.render('admin/edit-product', { admin: true, data });
        })
    },
    postEditProduct: (req, res) => {
        let id = req.params.id;
        let product = req.body;
        productHelpers.postEditProduct(id, product).then((data) => {
            res.redirect('/admin/view-products');
            //! NEED TO WRITE DOWN CODE FOR CHANGE THE IMAGE
        })
    },
    getDeleteProduct: (req, res) => {
        productHelpers.deleteProduct(req.params.id).then(() => {
            res.redirect('/admin/view-products');
        })
    },
    // get product offers page
    getOffers: (req, res) => {
        res.render('admin/product-offers', { admin: true, });
    },
    // creating product offer
    postOffer: (req, res) => {
        productHelpers.newOffer(req.body).then(() => {
            res.redirect('/admin/offers');
        })
    }


}

