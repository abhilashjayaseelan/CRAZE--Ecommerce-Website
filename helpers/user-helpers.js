const { user, products, orders, wishlist, wallet } = require("../models/connection");
const bcrypt = require('bcrypt');
const objectId = require('mongodb').ObjectId

module.exports = {
  doSignup: (userData) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      try {
        email = userData.email;
        mobile = userData.mobile;
        existingUser = await user.findOne({ $or: [{ email: email }, { mobile: mobile }] });
        if (existingUser) {
          response = { status: false }
          return resolve(response);
        } else {
          var hashedPassword = await bcrypt.hash(userData.password, 10);
          const data = new user({
            'name': userData.name,
            'mobile': userData.mobile,
            'email': userData.email,
            'password': hashedPassword,
          })
          await data.save(data).then((data) => {
            resolve({ data, status: true })
          })
        }
      } catch (err) {
        console.log(err);
      }
    })
  },

  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {};
        let user1 = await user.findOne({ email: userData.email });
        response = user1;
        // console.log(response.name);
        if (user1) {
          if (user1.blocked === false) {
            bcrypt.compare(userData.password, user1.password).then((status) => {
              if (status) {
                resolve({ response, status: true });
              } else {
                resolve({ blockedStatus: false, status: false });
              }
            })
          } else {
            resolve({ blockedStatus: true, status: false });
          }
        } else {
          resolve({ blockedStatus: false, status: false })
        }
      } catch (err) {
        console.log(Error);
      }
    })
  },

  otpLogin: (userNumber) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user1 = await user.findOne({ mobile: userNumber });
      response = user1
      resolve({ response });
    })
  },

  // home page
  homePage: () => {
    return new Promise(async (resolve, reject) => {
      await products.find().then((productDetails) => {
        if (productDetails) {
          resolve(productDetails);
        } else {
          reject(new Error)
        }
      })
    })
  },

  // getting items from the orders
  getOrders: async (userId) => {
    try {
      const orderItems = await orders.aggregate([
        {
          $match: { userId: objectId(userId) }
        },
        {
          $project: {
            id: '$orderId',
            status: '$orderStatus',
            totalPrice: '$totalPrice'
          }
        },
        {
          $project: {
            status: 1, totalPrice: 1, id: 1, item: 1, quantity: 1
          }
        }
      ]);
      return orderItems;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  // get oder details 
  getOrderDetails: (orderId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await orders.findOne({ orderId: orderId }).then((result) => {
          resolve(result);
        })
      } catch (err) {
        reject(err);
      }
    })
  },
  // get order products
  getOderProducts: async (orderId) => {
    try {
      const orderDetails = await orders.aggregate([
        {
          $match: { orderId: orderId }
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
            item: 1,
            quantity: 1,
            product: { $arrayElemAt: ['$product', 0] }
          }
        }
      ]);
      return orderDetails;
    } catch (err) {
      return [];
    }
  },

  // getting the order status
  getStatus: async (userId) => {
    let order = await orders.findOne({ userId: objectId(userId) });
    return (order);
  },

  // verify payment
  verifyingPayment: (details) => {
    return new Promise((resolve, reject) => {
      const crypto = require('crypto');
      let hmac = crypto.createHmac('sha256', 'VTe4tcPjxXRWHLbvpysPjnMJ');
      hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
      hmac = hmac.digest('hex')
      if (hmac == details['payment[razorpay_signature]']) {
        resolve();
      }
      else {
        reject();
      }
    })
  },

  // change payment status
  changePaymentStatus: (orderId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await orders.updateOne({ orderId: orderId },
          {
            $set: { paymentStatus: 'completed' }
          })
        resolve();

      } catch (err) {
        console.log(err);
        reject(err);
      }
    })
  },

  // cancel order
  cancelOrder: (orderId, newStatus) => {
    return orders.findOne({ orderId: orderId })
      .then((order) => {
        if (order) {
          return orders.updateOne({ orderId: orderId }, { $set: { orderStatus: newStatus } })
            .then(() => {
              return order;
            })
        } else {
          throw new Error('Order not found.');
        }
      })
      .catch((err) => {
        throw new Error('Error cancelling order.');
      });
  },

  // return order
  returnOrder: (orderId, newStatus) => {
    return orders.findOne({ orderId: orderId })
      .then((order) => {
        if (order) {
          return orders.updateOne({ orderId: orderId }, { $set: { orderStatus: newStatus } })
            .then(() => {
              return order;
            })
        } else {
          throw new Error('Order not found.');
        }
      })
      .catch((err) => {
        throw new Error('Error cancelling order.');
      });
  },   

  // add to wish-list
  addToWishlist: (userId, productId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userWishlist = await wishlist.findOne({ userId: objectId(userId) });
        if (userWishlist) {
          if (userWishlist.products.includes(objectId(productId))) {
            console.log('product already in the wishlist');
            resolve({ status: true });
          } else {
            await wishlist.updateOne({ userId: objectId(userId) }, { $push: { products: objectId(productId) } });
            resolve({ status: true });
          }
        } else {
          const newWishlist = new wishlist({
            userId: objectId(userId),
            products: [objectId(productId)]
          })
          await newWishlist.save();
          resolve({ status: true });
        }
      } catch (err) {
        reject(err);
      }
    })
  },
  // get user wish-list
  getWishlist: async (userId) => {
    try {
      const wishlistItems = await wishlist.aggregate([
        {
          $match: { userId: objectId(userId) }
        },
        {
          $unwind: '$products'
        },
        {
          $project: {
            item: '$products'
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
            item: 1,
            product: { $arrayElemAt: ['$product', 0] }
          }
        }
      ]);
      return wishlistItems;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  // remove from wish-list
  removeWish: (userId, productId) => {
    return new Promise((resolve, reject) => {
      try {
        wishlist.findOneAndUpdate({ userId: objectId(userId) },
          {
            $pull: { products: objectId(productId) }
          })
          .then((response) => {
            if (response) {
              resolve(response);
            } else {
              reject()
            }
          })
      } catch (err) {
        console.log(err);
        reject(err);
      }
    })
  },

  // giving refund to the cancelled orders
  initiateRefund: async (order, userId) => {
    // console.log(order, userId + '!!!!!!!!!');
    try {
      const amount = parseInt(order.totalPrice);
      const tranObj = {
        orderId: order.orderId,
        amount: amount,
        date: new Date()
      }
      const existingWallet = await wallet.findOne({ userId: objectId(userId) });
      if (existingWallet) {
        existingWallet.balance += amount;
        existingWallet.transactions.push(tranObj); // Add new transaction to array
        await existingWallet.save();
        return existingWallet;
      } else {
        const newWallet = new wallet({
          userId: objectId(userId),
          balance: amount,
          transactions: [tranObj] // Create new array with the new transaction
        })
        await newWallet.save();
        return newWallet;
      }
    } catch (err) {
      throw new Error('Error adding funds to wallet: ' + err.message);
    }
  },

  // user wallet
  getWallet: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await wallet.findOne({ userId: objectId(userId) }).then((response) => {
          resolve(response);
        })
      } catch (err) {
        reject(err) ; 
      }
    })
  }

}