const cartHelpers = require('../helpers/cart-helpers');
const userHelpers = require('../helpers/user-helpers');
const sendOtp = require('../middlewares/twilio');
const fs = require('fs');
const generateReport = require('../public/javascripts/generate-report');

module.exports = {
   // home page
   getHomePage: async (req, res) => {
      try {
         const user = req.session.user;
         const count = user ? await cartHelpers.productCount(user.response._id) : 0;
         const products = JSON.parse(JSON.stringify(await userHelpers.homePage()));
         res.render('user/view-products', { user, products, itsUser: true, count });
      } catch (err) {
         console.error(err);
         res.status(500).render('error', { message: 'Error getting home page', error: err });
      }
   },
   //  user signup 
   getSignup: (req, res) => {
      try {
         res.render('user/user-signup', { 'userExist': req.session.userExist });
         req.session.userExist = false;
      } catch (err) {
         console.error(err);
         res.status(500).render('error', { message: 'Error getting home page', error: err });
      }
   },
   postSignup: (req, res) => {
      try {
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
      } catch (err) {
         console.error(err);
         res.status(500).render('error', { message: 'Error in signup', error: err });
      }
   },
   // user login
   getLogin: (req, res) => {
      try {
         res.render('user/user-login', { 'loginErr': req.session.loginErr, 'statusErr': req.session.statusErr });
         req.session.loginErr = false;
         req.session.statusErr = false;
      } catch (err) {
         console.error(err);
         res.status(500).render('error', { message: 'Error getting login', error: err });
      }
   },
   postLogin: (req, res) => {
      try {
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
      } catch (err) {
         console.error(err);
         res.status(500).render('error', { message: 'Error getting login', error: err });
      }
   },
   // user logout
   userLogout: (req, res) => {
      try {
         req.session.user = false;
         res.redirect('/');
      } catch (err) {
         console.error(err);
         res.status(500).render('error', { message: 'Error in logout', error: err });
      }
   },
   // user otp login
   getOtpLogin: (req, res) => {
      try {
         res.render('user/otp-login', { 'accountErr': req.session.accountErr, 'statusErr': req.session.statusErr });
         req.session.statusErr = false;
         req.session.accountErr = false;
      } catch (err) {
         console.error(err);
         res.status(500).render('error', { message: 'Error while getting otp page', error: err });
      }
   },
   postOtpLogin: (req, res) => {
      try {
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
      } catch (err) {
         console.error(err);
         res.status(500).render('error', { message: 'Error in otp', error: err });
      }
   },
   // user otp verification
   getOtpVarification: (req, res) => {
      try {
         res.render('user/otp-varification', { 'otpErr': req.session.otpErr });
         req.session.otpErr = false;
      } catch (err) {
         console.error(err);
         res.status(500).render('error', { message: 'Error in otp varification', error: err });
      }
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
         res.status(500).send('internal error');
      }
   },
   // verify payment 
   verifyPayment: (req, res) => {
      try {
         userHelpers.verifyingPayment(req.body).then(() => {
            userHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
               res.json({ status: true });
            })
         })
      } catch (err) {
         console.log(err + 'payment error');
         res.json({ status: false });
      }
   },
   // generate invoice
   makeInvoice: async (req, res) => {
      const orderId = req.query.orderId;
      const { format } = req.body;
      // Check if format field is present
      if (!format) {
         return res.status(400).send('Format field is required');
      }
      // Generate the sales report using your e-commerce data
      const orderData = []
      try {
         orderData.push(await userHelpers.getOrderDetails(orderId));
      } catch (err) {
         console.log('Error calculating sales data:', err);
         return res.status(500).send('Error calculating sales data');
      }
      try {
         // Convert the report into the selected file format and get the name of the generated file
         const reportFile = await generateReport(format, orderData);
         // Set content type and file extension based on format
         let contentType, fileExtension;
         if (format === 'pdf') {
            contentType = 'application/pdf';
            fileExtension = 'pdf';
         } else if (format === 'excel') {
            console.log('proper format');
            contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            fileExtension = 'xlsx';
         } else {
            return res.status(400).send('Invalid format specified');
         }
         // Send the report back to the client and download it
         res.setHeader('Content-Disposition', `attachment; filename=sales-report.${fileExtension}`);
         res.setHeader('Content-Type', contentType);
         const fileStream = fs.createReadStream(reportFile);
         fileStream.pipe(res);
         fileStream.on('end', () => {
            console.log('File sent successfully!')
            // Remove the file from the server
            fs.unlink(reportFile, (err) => {
               if (err) {
                  console.log('Error deleting file:', err);
               } else {
                  console.log('File deleted successfully!');
               }
            })
         })
      } catch (err) {
         console.log('Error generating report:', err);
         return res.status(500).send('Error generating report');
      }

   },
   // show user orders
   showOrders: async (req, res) => {
      try {
         const user = req.session.user;
         const count = user ? await cartHelpers.productCount(user.response._id) : 0;
         const orders = await userHelpers.getOrders(user.response._id);
         const orderList = orders.reverse();
         res.render('user/orders', { user, itsUser: true, orderList, count });
      } catch (err) {
         console.error(err);
         res.status(500).render('error', { message: 'Error getting orders', error: err });
      }
   },
   // get order details
   orderDetails: async (req, res) => {
      try {
         const user = req.session.user;
         const orderId = req.query.orderId;

         const details = await userHelpers.getOrderDetails(orderId);
         const orderDetail = JSON.parse(JSON.stringify(details));
         const status = orderDetail.orderStatus;

         const products = await userHelpers.getOderProducts(orderId);
         const product = JSON.parse(JSON.stringify(products));
         const count = user ? await cartHelpers.productCount(user.response._id) : 0;

         res.render('user/order-details', { user, itsUser: true, orderDetail, product, status, count });

      } catch (error) {
         console.error(error);
         res.status(500).render('error', { message: 'Something went wrong. Please try again later.' });
      }
   },
   // cancel order
   cancelOrder: async (req, res) => {
      try {
         const newStatus = "cancelled";
         const userId = req.session.user.response._id;
         const result = await userHelpers.cancelOrder(req.body.orderId, newStatus);
         if (result.paymentMethod !== "COD") {
            const response = await userHelpers.initiateRefund(result, userId);
         }
         res.json({ res: true });
      } catch (err) {
         console.log("Error cancelling order:", err);
         res.json({ res: false });
      }
   },
   // return order
   returnOrder: (req, res) => {
      try {
         let newStatus = "return";
         userHelpers.returnOrder(req.body.orderId, newStatus).then(() => {
            res.json({ res: true });
         })
      } catch (err) {
         console.error(err);
         res.status(500).render('error', { message: 'Error while  returning order', error: err });
      }
   },

   // get wish-list
   showWishlist: async (req, res) => {
      try {
         const user = req.session.user;
         const count = user ? await cartHelpers.productCount(user.response._id) : 0;
         const wishlist = await userHelpers.getWishlist(user.response._id);
         const product = JSON.parse(JSON.stringify(wishlist));
         res.render('user/user-wishlist', { user, itsUser: true, product, count });
      } catch (err) {
         console.log(err);
         res.render('error', { message: "error getting wish list", error: err })
      }
   },
   // add to wish-list
   addToWishlist: (req, res) => {
      try {
         const userId = req.session.user.response._id;
         const productId = req.query.productId;
         userHelpers.addToWishlist(userId, productId).then((result) => {
            if (result) {
               res.json({ status: true });
            } else {
               res.json({ status: false });
            }
         })
      } catch (err) {
         console.error(err);
         res.status(500).render('error', { message: 'error while adding wish list', error: err });
      }
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
   getWallet: async (req, res) => {
      try {
         const user = req.session.user;
         const userId = user.response._id;
         const count = user ? await cartHelpers.productCount(user.response._id) : 0;
         const wallet = await userHelpers.getWallet(userId);
         const transactions = wallet?.transactions.reverse();
         res.render('user/user-wallet', { user, wallet, count, transactions });
      } catch (error) {
         console.error(error);
         res.status(500).send('internal error');
      }
   },

   // apply coupon code
   applyCoupon: async (req, res) => {
      try {
         const { couponCode } = req.body
         const { cartItems, cartTotal } = req.session;
         const result = await userHelpers.applyCoupon(couponCode, cartItems, cartTotal);
         if (result.status === 'invalid') {
            res.json({ error: 'Invalid coupon code' });
         } else if (result.status === 'minAmount') {
            res.json({ error: 'Cart total does not meet the minimum total amount' });
         } else if (result.status === 'expired') {
            res.json({ error: 'This coupon has expired' });
         } else if (result.status === 'used') {
            res.json({ error: 'This coupon has already used' });
         } else {
            const newTotal = cartTotal - result;
            req.session.discountPrice = result;
            req.session.afterDiscount = newTotal;
            req.session.couponCode = couponCode;
            res.json({ offer: result, total: newTotal, success: 'Coupon applied' })
         }
         req.session.cartItems = false;
         req.session.cartTotal = false;
      } catch (err) {
         console.log(err);
         res.status(500).send('internal error');
      }
   },

   // get landing page
   getLanding: (req, res) => {
      try {
         res.render('user/order-landing-page');
      } catch (err) {
         console.log(err);
         res.status(500).send('internal error')
      }
   }

}            