const categoryHelper = require('../helpers/category-helper');

module.exports = {
    // get product categoiries
    getProductCategory: (req, res) => {
        try {
            categoryHelper.getCategory().then((response) => {
                let categories = JSON.parse(JSON.stringify(response));
                res.render('admin/admin-productCategory',
                    { categories, sub: categories.subCategory, admin: true });
            })
        } catch (err) {
            console.log(err);
        }
    },
    // adding new product category
    addProductCategory: (req, res) => {
        existCategory = true;
        categoryHelper.addCategory(req.body).then((result) => {
            let existCategory = result.status;
            res.redirect('/admin/add-productCategory');
        })
    },
    // geting subcategories
    getSubCategories: (req, res) => {
        categoryHelper.getSubCategory(req.body).then((category) => {
            res.json(category);
        })
            .catch((err) => {
                console.log(err);
            })
    }
}