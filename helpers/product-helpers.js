const { products, category, discount } = require("../models/connection");

module.exports = {
    addProduct: (productData) => {
        return new Promise(async (resolve, reject) => {
            let product = new products({
                'category': productData.category,
                'subCategory': productData.subCategory,
                'name': productData.name,
                'brand': productData.brand,
                'color': productData.color,
                'size': productData.size,
                'description': productData.description,
                'price': productData.price,
                'totalQty': productData.totalQty,
            })
            await product.save()
            resolve(product);
        })
            .catch(err => {
                console.log(err);
            })
    },
    getProducts: () => {
        return new Promise(async (resolve, reject) => {
            await products.find().then((products) => {
                resolve(products);
            })
        })
            .catch((err) => {
                console.log(err);
            })
    },
    getProduct: (productId) => {
        return new Promise((resolve, reject) => {
            products.findOne({ _id: productId }).then((product) => {
                // console.log(product);
                resolve(product);
            })
        })
    },
    getEditProduct: (id) => {
        return Promise.all([
            products.findOne({ _id: id }),
            category.find()
        ]).then(([product, categories]) => {
            return { product, categories }
        })
            .catch((err) => {
                console.log(err);
            })

    },
    postEditProduct: (productId, productData) => {

        return new Promise(async (resolve, reject) => {
            await products.updateOne({ _id: productId }, {
                $set: {
                    'category': productData.category,
                    'subCategory': productData.subCategory,
                    'name': productData.name,
                    'brand': productData.brand,
                    'color': productData.color,
                    'size': productData.size,
                    'description': productData.description,
                    'price': productData.price,
                    'totalQty': productData.totalQty,
                }
            })
            resolve();
        })
            .catch((err) => {
                console.log(err);
            })
    },
    deleteProduct: (productID) => {
        return new Promise(async (resolve, reject) => {
            await products.deleteOne({ _id: productID }).then((result) => {
                resolve(result);
            })
        })
    },
    // new offer
    newOffer: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const newDiscount = new discount({
                    'category': data.category,
                    'subCategory': data.subCategory,
                    'discountPercentage': data.discountPercentage,
                    'startDate': data.startDate,
                    'endDate': data.endDate
                })
                await newDiscount.save();

                const productsToUpdate = await products.find({ category: newDiscount.category, subCategory: newDiscount.subCategory });
                // Update discounted price of each product if offer is active
                // console.log('its here'+ productsToUpdate);
                productsToUpdate.forEach(async (product) => {
                    if (newDiscount.startDate <= Date.now() && newDiscount.endDate >= Date.now()) {
                        const discountedPrice = Math.floor(product.price * (1 - newDiscount.discountPercentage / 100));
                        product.discount = newDiscount.discountPercentage;  
                        product.discountedPrice = discountedPrice;
                        product.discountTil = newDiscount.endDate;
                        await product.save();
                    }
                });
                resolve();
            } catch (err) {
                console.log(err);
                reject();
            }
        })
    }
}

