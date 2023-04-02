const ObjectId = require('mongodb').ObjectId;
const { products, category, discount, orders, review } = require('../config/connection');
const slugify = require('slugify');

module.exports = {
    // filtering based categories
    categoryFilter: async (category) => {
        try {
            const filteredProducts = await products.find({ category: category });
            return filteredProducts;
        } catch (err) {
            console.log(err);
            return err;
        }
    },
    //admin side
    // adding a new product
    addProduct: async (productData, images) => {
        const slug = slugify(`${productData.subCategory} ${productData.name}`);
        try {
            const product = new products({
                slug: slug,
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
        try {
            return new Promise(async (resolve, reject) => {
                await products.find().then((products) => {
                    resolve(products);
                })
            })
        } catch (err) {
            console.log(err);
            reject(err)
        }
    },
    // single product
    getProduct: async (slug) => {
        try {
            const product = await products.findOne({ slug });
            return product;
        } catch (err) {
            console.log(err);
            return err;
        }
    },
    // admin side product edit
    getEditProduct: (slug) => {
        try {
            return Promise.all([
                products.findOne({ slug: slug }),
                category.find()
            ]).then(([product, categories]) => {
                return { product, categories }
            })
        } catch (err) {
            console.log(err);
            return err;
        }

    },
    // saving edited details
    postEditProduct: async (productId, productData) => {
        const slug = slugify(`${productData.subCategory} ${productData.name}`);
        try {
            await products.updateOne({ _id: productId }, {
                $set: {
                    'slug': slug,
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
            });
        } catch (err) {
            console.log(err);
            return err;
        }
    },
    // deleting product
    deleteProduct: (productID) => {
        try {
            return new Promise(async (resolve, reject) => {
                await products.deleteOne({ _id: productID }).then((result) => {
                    resolve(result);
                })
            })
        } catch (err) {
            console.log(err);
            reject(err)
        }
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
                reject(err);
            }
        })
    },
    // getting all offers
    getOffers: async () => {
        try {
            const offers = await discount.find().lean();
            const offer = offers ? offers : [];
            return offer;
        } catch (err) {
            console.log(err);
            return err;
        }
    },

    // changing quantity after order placing
    decreaseProductQuantity: async (orderProducts) => {
        try {
            for (let i = 0; i < orderProducts.length; i++) {
                const productId = orderProducts[i].item;
                const quantity = orderProducts[i].quantity

                await products.updateOne(
                    { _id: ObjectId(productId) },
                    { $inc: { totalQty: -quantity } }
                )
            }
        } catch (err) {
            console.log(err);
        }
    },

    // adding product review
    addProductReview: async (ratingInfo, userInfo) => {
        try {
            const { starRating, comment, productId } = ratingInfo;
            const { _id: userID, name, email } = userInfo;
            const purchased = await orders.aggregate([
                {
                    $match: {
                        userId: ObjectID(userID),
                        orderStatus: 'recieved'
                    }
                },
                {
                    $unwind: "$products",
                },
                {
                    $match: {
                        "products.item": ObjectId(productId),
                    },
                },
                {
                    $project: {
                        _id: 0,
                        orderId: "$_id",
                        productId: "$products.item",
                    },
                },
            ])
            if (purchased.length === 0) {
                return {
                    Message: 'You cannot rate this product unless you have already purchased it.',
                    notPurchased: true
                }
            }
            // if already posted a review 
            const alreadyPosted = await review.findOne({
                product: ObjectID(productId),
                'user.userID': ObjectID(userID)
            })
            console.log(alreadyPosted);
            if (alreadyPosted) {
                return {
                    Message: 'You have already submitted the review.',
                    alreadyPosted: true
                }
            }
            const newRating = new review({
                product: ObjectID(productId),
                rating: parseInt(starRating),
                review: comment,
                user: {
                    userID: ObjectID(userID),
                    name,
                    email,
                }
            })
            await newRating.save();
            return {
                Message: 'Review added',
                newRating: true
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    },

    // getting product reviews
    getProductReviews: async (prodId) => {
        try {
            const productReviews = await review.find({ product: ObjectID(prodId) }).lean();
            return productReviews;
        } catch (err) {
            console.log(err);
            return err;
        }
    },
    // getting product rating
    getProductRating: async (prodId) => {
        try {

        } catch (err) {
            console.log(err);
            return err;
        }
    },
    // getting all reviews
    allReviews: async () => {
        try {
            const allReviews = await review.find().lean();
            return allReviews;
        } catch (err) {
            console.log(err);
            return err;
        }
    },
    // getting product stock
    getProductStock: async (data) => {
        try {
            const product = await products.find({ _id: ObjectID(data.product) }).lean();
            return product[0].totalQty;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}

