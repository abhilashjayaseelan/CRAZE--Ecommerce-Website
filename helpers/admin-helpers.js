const {user, orders, couponTemplateSchema } = require('../models/connection');
const bcrypt = require('bcrypt');
objectId = require('mongodb').ObjectId;

module.exports = {
    // get users
    getUsers: async () => {
        try {
            const users = await user.find();
            return users;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    // block user
    blockUser: async (userId) => {
        try {
            const result = await user.updateOne({ _id: userId }, { $set: { blocked: true } });
            console.log('user blocked');
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    // unblock user
    unblockUser: async (userId) => {
        try {
            const result = await user.updateOne({ _id: userId }, { $set: { blocked: false } });
            console.log('user unblocked');
            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    // get user orders
    getOrders: async() => {
        try {
            const allOrders = await orders.find().lean();
            return allOrders;
        } catch (err) {
            console.log(err);
            return err;
        }
    },
    //search orders
    searchOrder: (orderId) => {
        return new Promise(async (resolve, reject) => {
            try {
                await orders.find({ orderId: orderId }).then((allOrders) => {
                    resolve(allOrders);
                })
            } catch (err) {
                reject(err);
            }
        })
    },
    // order details
    orderDetails: (orderId) => {
        return new Promise(async (resolve, reject) => {
            try {
                orders.findOne({ _id: orderId }).then((details) => {
                    resolve(details);
                })
            } catch (err) {
                reject(err);
            }
        })
    },
    // getting day wise orders
    dateWiseReport: async (details) => {
        // console.log(details);
        try {
            const fromDate = new Date(details.fromDate);
            const toDate = new Date(details.toDate);
            toDate.setDate(toDate.getDate() + 1);

            const order = await orders.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: fromDate,
                            $lt: toDate
                        },
                        orderStatus: 'recieved'
                    }
                },
                {
                    $group: {
                        _id: {
                            date: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$createdAt"
                                }
                            }
                        },
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: "$totalPrice" }
                    }
                }
            ]);
            console.log("orders", order);
            return order;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    // getting items from the orders
    singleOrder: async (orderId) => {
        try {
            const orderItems = await orders.aggregate([
                {
                    $match: { _id: objectId(orderId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }
            ]);
            return orderItems;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    //change order status
    changeStatus: (orderDetails) => {
        // console.log(orderDetails);
        return new Promise(async (resolve, reject) => {
            try {
                await orders.updateOne({ _id: objectId(orderDetails.orderId) },
                    {
                        $set: {
                            orderStatus: orderDetails.newStatus
                        }
                    })
                resolve();
            } catch (err) {
                reject(err);
            }
        })
    },
    // create new coupon 
    createCoupon: async (details) => {

        try {
            const newCoupon = new couponTemplateSchema({
                'discountPercentage': details.discountPercentage,
                'maxDiscountAmount': details.maxDiscountAmount,
                'minAmount': details.minAmount,
                'category': details.category,
                'description': details.description
            })
            await newCoupon.save();
            return newCoupon;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    // get coupons
    getCoupons: async ()=>{
        try {
            const coupons = await couponTemplateSchema.find().lean();
            return coupons;
        } catch (err) {
            clg(err);
            throw err;
        }
    }
}