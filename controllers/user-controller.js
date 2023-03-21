const userHelpers = require('../helpers/user-helpers');
const sendOtp = require('../middlewares/twilio');

module.exports = {
   // home page
   getHomePage: async (req, res) => {
      userHelpers.homePage().then((data) => {
         let user = req.session.user;
         products = JSON.parse(JSON.stringify(data));
         // console.log(products);
         res.render('user/view-products', { user, products, itsUser: true });
      })
   },
   //  user signup 
   getSignup: (req, res) => {
      res.render('user/user-signup', { 'userExist': req.session.userExist });
      req.session.userExist = false;
   },
   postSignup: (req, res) => {
      existStatus = true;
      userHelpers.doSignup(req.body).then((response) => {
         var existStatus = response.status;
         if (existStatus === true) {
            res.redirect('/login');
         } else {
            req.session.userExist = "Email or Phone already exist!!!!"
            res.redirect('/signup');
         }
      })
   },
   // user login
   getLogin: (req, res) => {
      res.render('user/user-login', { 'loginErr': req.session.loginErr, 'statusErr': req.session.statusErr });
      req.session.loginErr = false;
      req.session.statusErr = false;
   },
   postLogin: (req, res) => {
      userHelpers.doLogin(req.body).then((response) => {
         loginStatus = response.status;
         req.session.user = response
         blockedStatus = response.blockedStatus;
         if (loginStatus === true) {
            res.redirect('/');
         } else if (blockedStatus === true) {
            req.session.statusErr = "Access has been denied";
            res.redirect('/login');
         } else {
            req.session.loginErr = "Invalid email or password"
            res.redirect('/login');
         }
      })
   },
   // user logout
   userLogout: (req, res) => {
      req.session.user = false;
      res.redirect('/');
   },
   // user otp login
   getOtpLogin: (req, res) => {
      res.render('user/otp-login', { 'accountErr': req.session.accountErr, 'statusErr': req.session.statusErr });
      req.session.statusErr = false;
      req.session.accountErr = false;
   },
   postOtpLogin: (req, res) => {
      userHelpers.otpLogin(req.body.mobile).then((user) => {
         req.session.user = user;
         console.log(user);

         if (user.response !== null) {
            sendOtp.send_otp(user.response.mobile).then((response) => {
               // console.log(response);
               // res.send(`otp sented to ${user.mobile}`);
               req.session.mobile = req.body.mobile;
               res.redirect('/otp-varification')
            })
         } else if (user.response === null) {
            req.session.accountErr = "No account found with the entered number";
            res.redirect('/otp-login');

         } else if (user.respose.blocked !== false) {
            req.session.statusErr = "Access has been denied";
            res.redirect('/otp-login')
         }
      })
   },
   // user otp verification
   getOtpVarification: (req, res) => {
      res.render('user/otp-varification', { 'otpErr': req.session.otpErr });
      req.session.otpErr = false;
   },
   postOtpVarification: async (req, res) => {
      try {
         let mobile = req.session.mobile;
         console.log(mobile);
         let otp = req.body.otp;
         sendOtp.verifying_otp(mobile, otp).then((varification) => {
            // console.log(verification.status);
            if (varification.status === 'approved') {
               res.redirect('/');
            } else {
               req.session.otpErr = "Invalid OTP";
               res.redirect('/otp-varification');
            }
         })
      } catch (err) {
         console.log(`error: ${err}`);
      }
   },
   // verify payment 
   verifyPayment: (req, res) => {
      console.log(req.body);
      userHelpers.verifyingPayment(req.body).then(() => {
         console.log('its here');
         userHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
            res.json({ status: true });
         })
      })
         .catch((err) => {
            console.log(err + 'errorrrrr');
            res.json({ status: false });
         })
   },
   // show user orders
   showOrders: async (req, res) => {
      let user = req.session.user;
      userHelpers.getOrders(user.response._id).then((orderList) => {
         res.render('user/orders', { user, itsUser: true, orderList })
      })
         .catch((err) => {
            console.log(err);
         })

   },
   // get order details
   orderDetails: (req, res) => {
      const user = req.session.user;
      const orderId = req.query.orderId;
      userHelpers.getOrderDetails(orderId).then((details) => {
         const orderDetail = JSON.parse(JSON.stringify(details));
         const status = orderDetail.orderStatus;
         userHelpers.getOderProducts(orderId).then((products) => {
            const product = JSON.parse(JSON.stringify(products));
            res.render('user/order-details', { user, itsUser: true, orderDetail, product, status });
         })
      })
   },
   // cancel order
   cancelOrder: (req, res) => {
      let newStatus = "cancelled"
      let userId = req.session.user.response._id;
      userHelpers.cancelOrder(req.body.orderId, newStatus).then((result) => {
         if (result.paymentMothod !== 'COD') {
            userHelpers.initiateRefund(result, userId).then((response) => {
               console.log('Refund initiated for online payment');
               res.json({ res: true });
            })
               .catch((err) => {
                  // console.log('Error initiating refund:', err);  
                  res.json({ res: false });
               });
         } else {
            res.json({ res: true });
         }
      })
         .catch((err) => {
            console.log('Error cancelling order:', err);
            res.json({ res: false });
         })
   },
   // return order
   returnOrder: (req, res) => {
      let newStatus = "return";
      userHelpers.returnOrder(req.body.orderId, newStatus).then(() => {
         res.json({ res: true });
      })
   },

   // get wish-list
   showWishlist: (req, res) => {
      const user = req.session.user;
      userHelpers.getWishlist(user.response._id).then((wishlist) => {
         const product = JSON.parse(JSON.stringify(wishlist));
         res.render('user/user-wishlist', { user, itsUser: true, product });
      })
   },
   // add to wish-list
   addToWishlist: (req, res) => {
      const userId = req.session.user.response._id;
      const productId = req.query.productId;
      userHelpers.addToWishlist(userId, productId).then((result) => {
         if (result) {
            res.json({ status: true });
         } else {
            res.json({ status: false });
         }
      })

   },
   // remove from wish-list
   removeWish: (req, res) => {
      const userId = req.session.user.response._id;
      const productId = req.query.productId;
      userHelpers.removeWish(userId, productId).then(() => {
         res.json({ status: true });
      })
         .catch((err) => {
            console.log(err);
         })
   },

   // user wallet
   getWallet: (req, res) => {
      const userId = req.session.user.response._id;
      userHelpers.getWallet(userId).then((response) => {
         res.json({ response });
      })
         .catch((err) => {
            console.log(err);
         })
   }

}            