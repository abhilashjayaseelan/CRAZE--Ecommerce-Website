const { category } = require('../models/connection');

module.exports = {
    addCategory: (categoryData) => {
        return new Promise(async (resolve, reject) => {
            try {
                let name = categoryData.name;
                let subCategory = categoryData.subCategory;
                const existingCategory = await category.findOne({ name: name });
                if (existingCategory) {
                    existingCategory.subCategory.push(subCategory);
                    existingCategory.save();
                    resolve(existingCategory);
                } else {
                    const newCategory = new category({
                        'name': categoryData.name,
                        'subCategory': categoryData.subCategory
                    })
                    await newCategory.save();
                    resolve(newCategory);
                }
            } catch (err) {
                console.log(err);
                reject(err);
            }

        })
    },
    // for adding product finding sub categories
    getSubCategory: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const categories = await category.findOne({ name: data.mainCategory });
                resolve(categories);
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    },

    // get all categories
    getCategory: async () => {
        try {
            const result = await category.find();
            return result;
        } catch (err) {
            console.log(err);
            throw new Error('Error fetching categories');
        }
    }

}   