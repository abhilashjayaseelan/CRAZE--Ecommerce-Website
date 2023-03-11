const { user, products, orders } = require("../models/connection");
const bcrypt = require('bcrypt');
const { response } = require("../app");
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

  // getting the order status
  getStatus: async (userId) => {
    let order = await orders.findOne({ userId: objectId(userId) });
    return (order);
  },

  // varify payment
  varifyingPayment: (details) => {
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
    return new Promise(async (resolve, reject) => {
      try {
        await orders.updateOne({ orderId: orderId },
          {
            $set: { orderStatus: newStatus }
          })
        resolve();
      } catch (err) {
        reject(err);
      }
    })
  }
}