const productHelpers = require("../helpers/product-helpers");
const categoryHelpers = require("../helpers/category-helper");

module.exports = {
    // user side 
    getProduct: (req, res) => {
        const productId = req.params.id;
        const user = req.session.user;
        productHelpers.getProduct(productId).then((data) => {
            const product = JSON.parse(JSON.stringify(data));
            res.render('user/single-product', { user, product, itsUser: true });

        })
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
    postAddProduct: (req, res) => {
        // console.log(req.body);
        productHelpers.addProduct(req.body).then((data) => {
            let image = req.files.images;
            let objId = data.id;
            image.mv('./public/images/' + objId + '.jpg', err => {
                if (!err) {
                    req.session.addProductSuccess = "Prouct Added successfully"
                    req.session.addProductStatus = true;
                    res.redirect('/admin/add-product');
                }
                else {
                    req.session.addProductStatus = false;
                    res.redirect('/admin/add-product');
                }
            })
        })

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
        let user = req.body;
        productHelpers.postEditProduct(id, user).then((data) => {
            res.redirect('/admin/view-products');
            if (req.files) {
                let image = req.files.image;
                image.mv('./public/images/' + id + '.jpg')
            }
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

