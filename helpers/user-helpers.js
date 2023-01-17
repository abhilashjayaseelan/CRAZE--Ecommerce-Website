const { user, products } = require("../models/connection");
const bcrypt = require('bcrypt');
const { response } = require("../app");

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
  }

}