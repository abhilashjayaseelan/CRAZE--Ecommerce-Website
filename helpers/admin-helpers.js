const { admin, user, orders, coupon } = require('../models/connection');
const bcrypt = require('bcrypt');
objectId = require('mongodb').ObjectId;

module.exports = {
    // admin login
    adminLogin: async (adminData) => {
        try {
            const admin1 = await admin.findOne({ email: adminData.email });
            if (!admin1) {
                return { notExist: true };
            }
            const status = await bcrypt.compare(adminData.password, admin1.password);
            if (!status) {
                return { status: false };
            }
            return { admin: admin1, status: true };
        } catch (err) {
            throw new Error(err);
        }
    },
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
    getOrders: () => {
        return new Promise(async (resolve, reject) => {
            try {
                await orders.find().then((allOrders) => {
                    resolve(allOrders);
                })
            } catch (err) {
                reject(err);
            }
        })
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
    createCoupon: async(details) =>{ 
        try {
            const newCoupon = new coupon({
                'code' : details.code,
                'discountPercentage' : details.discountPercentage,
                'maxDiscountAmount' : details.maxDiscountAmount,
                'minAmount' : details.minAmount,
                'startDate' : details.startDate,
                'endDate': details.endDate
            })
            await newCoupon.save();
            return newCoupon;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}