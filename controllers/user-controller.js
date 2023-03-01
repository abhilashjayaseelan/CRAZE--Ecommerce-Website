const { response } = require('../app');
const userHelpers = require('../helpers/user-helpers');
const twilio = require('twilio');
const sendOtp = require('../middlewares/twilio');
const { Enqueue } = require('twilio/lib/twiml/VoiceResponse');



module.exports = {
   // home page
   getHomePage: async (req, res) => {
      userHelpers.homePage().then((data) => {
         let user = req.session.user;
         products = JSON.parse(JSON.stringify(data));
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
         // console.log(user);
         // console.log(user.blocked);
         if (user.blocked) {
            req.session.statusErr = "Access has been denied";
            res.redirect('/otp-login')
         } else if (user !== null) {
            sendOtp.send_otp(user.mobile).then((response) => {
               console.log(response);
               // res.send(`otp sented to ${user.mobile}`);
               req.session.mobile = req.body.mobile;
               res.redirect('/otp-varification')
            })
         } else {
            req.session.accountErr = "No account found with the entered number";
            res.redirect('/otp-login');

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
            console.log(varification.status);
            if (varification.status === 'approved') {
               req.session.user = true;
               res.redirect('/');
            } else {
               req.session.otpErr = "Invalid Otp";
               res.redirect('/otp-varification');
            }
         })
      } catch (err) {
         console.log(`error: ${err}`);
      }
   },
   showOrders: async (req, res) => {
      let user = req.session.user;
      let order = await userHelpers.getStatus(user.response._id);
      userHelpers.getOrders(user.response._id).then((orderList) => {
         res.render('user/orders', { user, itsUser: true, orderList})
      })
         .catch((err) => {
            console.log(err);
         })

   },
   // cancel order
   cancelOrder: (req, res) => {
      let newStatus = "cancelled"
      userHelpers.cancelOrder(req.body.orderId, newStatus).then((result) =>{
         res.json({res: true});
      })
      .catch((err) =>{
         console.log(err);
      })
   }

}            