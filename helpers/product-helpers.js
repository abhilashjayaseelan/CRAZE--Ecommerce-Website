const { products, category, discount } = require("../models/connection");

module.exports = {
    // filtering based categories
    categoryFilter: async(category) =>{
        try {
            const filteredProducts = await products.find({category: category});
            return filteredProducts;
        } catch (err) {
            console.log(err);
            return err;
        }
    },
    //admin side
    // adding a new product
    addProduct: async (productData, images) => {
        try {
            const product = new products({
                category: productData.category,
                subCategory: productData.subCategory,
                name: productData.name,
                brand: productData.brand,
                color: productData.color,
                size: productData.size,
                description: productData.description,
                price: productData.price,
                totalQty: productData.totalQty,
                images: {
                    image1: images[0],
                    image2: images[1],
                    image3: images[2],
                    image4: images[3]
                }
            });
            await product.save();
            return product;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    // getting all products
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
    // single product
    getProduct: (productId) => {
        return new Promise((resolve, reject) => {
            products.findOne({ _id: productId }).then((product) => {
                // console.log(product);
                resolve(product);
            })
        })
    },
    // admin side product edit
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
    // saving edited details
    postEditProduct: (productId, productData) => {
        console.log(productData);
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
    // deleting product
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

