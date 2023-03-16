const categoryHelper = require('../helpers/category-helper');

module.exports = {
    getProductCategory: (req, res) => {
        categoryHelper.getCategory().then((response) => {
            let categories = JSON.parse(JSON.stringify(response));
            res.render('admin/admin-productCategory', 
            { categories, sub: categories.subCategory, admin: true });
        })
    },
    addProductCategory: (req, res) => {
        existCategory = true;
        categoryHelper.addCategory(req.body).then((result) => {
            let existCategory = result.status;
            res.redirect('/admin/add-productCategory');
            // if (existCategory === true) {
            // } else {
            //     res.send('category already exists');
            // }
        })
    },

    // geting subcategories
    getSubCategories: (req, res) =>{
        categoryHelper.getSubCategory(req.body).then((category) =>{
            res.json(category);
        })
        .catch((err) =>{
            console.log(err);
        })
    }
}