const { admin, user, orders } = require('../models/connection');
const bcrypt = require('bcrypt');
const { response } = require('../app');
const { calculateObjectSize } = require('bson');
objectId = require('mongodb').ObjectId;

module.exports = {
    // admin login
    adminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let admin1 = await admin.findOne({ email: adminData.email });
            if (admin1) {
                await bcrypt.compare(adminData.password, admin1.password).then((status) => {
                    if (status) {
                        response.admin = admin1;
                        response.status = true;
                        resolve(response)
                    } else {
                        // console.log(status);
                        resolve({ status: false });
                    }
                })
            } else {
                resolve({ notExist: true });
            }
        })
    },
    // get users
    getUsers: () => {
        return new Promise(async (resolve, reject) => {
            await user.find().then((users) => {
                userDatas = users;
            })
            resolve(userDatas);
        })
    },
    // block user
    blockUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            await user.updateOne({ _id: userId }, { $set: { blocked: true } }).then((result) => {
                console.log('user blocked');
                resolve(result);
            })
        })
    },
    // unblock user
    unblockUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            await user.updateOne({ _id: userId }, { $set: { blocked: false } }).then((result) => {
                console.log('user unblocked');
                resolve(result);
            })
        })
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
    searchOrder: (orderId) =>{
        return new Promise(async(resolve, reject) =>{
            try {
                await orders.find({orderId: orderId}).then((allOrders)=>{
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
        console.log(orderDetails);
        return new Promise(async(resolve, reject) => {
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
    }
}