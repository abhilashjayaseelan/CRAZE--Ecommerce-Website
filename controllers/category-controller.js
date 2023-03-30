const categoryHelper = require('../helpers/category-helper');

module.exports = {
    // get product categories
    getProductCategory: (req, res) => {
        try {
            categoryHelper.getCategory().then((response) => {
                let categories = JSON.parse(JSON.stringify(response));
                res.render('admin/admin-productCategory',
                    { categories, sub: categories.subCategory, admin: true });
            })
        } catch (err) {
            console.log(err);
            res.status(500).send('internal error');
        }
    },
    // adding new product category
    addProductCategory: (req, res) => {
        try {
            existCategory = true;
            categoryHelper.addCategory(req.body).then((result) => {
                let existCategory = result.status;
                res.redirect('/admin/add-productCategory');
            })
        } catch (err) {
            console.log(err);
            res.status(500).send('internal error');
        }
    },
    // getting subcategories
    getSubCategories: (req, res) => {
        try {
            categoryHelper.getSubCategory(req.body).then((category) => {
                res.json(category);
            })
        } catch (err) {
            console.log(err);
            res.status(500).send('internal error');
        }
    }
}