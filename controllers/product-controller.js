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
            const reviews = await productHelpers.getProductReviews(product._id);
            //const ratings = await productHelpers.getProductRating(product._id);
            const rateCount = reviews.length;
            res.render('user/single-product', { user, product, itsUser: true, count, reviews, rateCount });
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { message: 'Error getting product', error: err });
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
        try {
            productHelpers.getProducts().then((product) => {
                let products = JSON.parse(JSON.stringify(product));
                res.render('admin/admin-products', { admin: true, products });
            })
        } catch (err) {
            console.log(err);
            res.status(500).send('internal error');
        }

    },
    // product adding 
    getAddProduct: (req, res) => {
        try {
            res.render('admin/add-products', { admin: true, 'addProductSuccess': req.session.addProductSuccess });
            req.session.addProductSuccess = false;
        } catch (err) {
            console.log(err);
            res.status(500).send('internal error');
        }
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
        try {
            productHelpers.getEditProduct(req.params.id).then((products) => {
                let data = JSON.parse(JSON.stringify(products))          // console.log(data);
                res.render('admin/edit-product', { admin: true, data });
            })
        } catch (err) {
            console.log(err);
            res.status(500).send('internal error');
        }
    },
    postEditProduct: (req, res) => {
        try {
            let id = req.params.id;
            let product = req.body;
            productHelpers.postEditProduct(id, product).then((data) => {
                res.redirect('/admin/view-products');
                //! NEED TO WRITE DOWN CODE FOR CHANGE THE IMAGE
            })
        } catch (err) {
            console.log(err);
            res.status(500).send('internal error');
        }
    },
    getDeleteProduct: (req, res) => {
        productHelpers.deleteProduct(req.params.id).then(() => {
            res.redirect('/admin/view-products');
        })
    },
    // get product offers page
    getOffers: async (req, res) => {
        try {
            const offers = await productHelpers.getOffers();
            res.render('admin/product-offers', { admin: true, offers });
        } catch (err) {
            console.log(err);
            res.status(500).send('internal error');
        }
    },
    // creating product offer
    postOffer: (req, res) => {
        try {
            productHelpers.newOffer(req.body).then(() => {
                res.redirect('/admin/offers');
            })
        } catch (err) {
            console.log(err);
            res.status(500).send('internal error');
        }
    },
    // posting product review
    postProductReview: async(req, res) =>{
        try {
            const userData = req.session.user.response;
            const response = await productHelpers.addProductReview(req.body, userData);
            res.json(response);
        } catch (err) {
            console.log(err);
            res.status(500).json({message: 'Error while adding review'});
        }
    },
    // getting all product reviews
    getAllReviews: async(req, res) =>{
        try {
            const allReviews = await productHelpers.allReviews();
            const prodReviews = allReviews.reverse();
            res.render('admin/product-reviews', {admin: true, prodReviews});
        } catch (err) {
            console.log(err);
            res.status(500).render('error', {message: 'Error getting reviews'});
        }
    }
}

