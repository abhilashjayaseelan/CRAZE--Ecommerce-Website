const {category} = require('../models/connection');

module.exports = {
    addCategory: (categoryData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let category1 = categoryData.name;
            existingCategory = await category.findOne({ name: category1 });
            response = { status: false }
            resolve(response);
            let data = new category({
                'name': categoryData.name,
                'subCategory': categoryData.subCategory
            })
            await data.save().then((data) => {
                resolve({ data, status: true });
            })
        })
    },
    getCategory: () => {
        return new Promise(async (resolve, reject) => {
            await category.find().then((categories) => {
                resolve(categories);
            })
        })
    },

}   