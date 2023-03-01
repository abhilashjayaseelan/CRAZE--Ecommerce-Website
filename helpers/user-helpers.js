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
      let user1 = await user.findOne({ mobile: userNumber });
      resolve(user1);
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
          $unwind: '$products'
        },
        {
          $project: {
            item: '$products.item',
            quantity: '$products.quantity',
            id: '$_id',
            status: '$orderStatus'
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
            status: 1, id: 1, item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
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
  // cancel order
  cancelOrder: (orderId, newStatus) => {
    return new Promise(async (resolve, reject) => {
      try {
        await orders.updateOne({ _id: orderId },
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