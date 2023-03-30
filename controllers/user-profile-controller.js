const userProfileHelpers = require('../helpers/user-profile-helpers');
const cartHelpers = require('../helpers/cart-helpers');

module.exports = {
    // getting user profile
    getProfile: async (req, res) => {
        try {
            const id = req.query.id;
            req.session.id = req.params.id;
            const count = await cartHelpers.productCount(id);
            const profile = await userProfileHelpers.userProfile(id);
            req.session.profile = profile;
            let user = JSON.parse(JSON.stringify(profile));
            res.render('user/profile', { user, itsUser: true, count });
        } catch (err) {
            console.error(err);
            res.render('error', { message: 'Error getting profile', error: err });
        }
    },
    // getting address page
    getAddress: async (req, res) => {
        try {
            const user = req.session.user;
            const count = user ? await cartHelpers.productCount(user.response._id) : 0;
            res.render('user/address', { user, count })
        } catch (err) {
            console.log(err);
            res.status(500).render('error', { message: 'error getting address', error: err });
        }
    },
    postAddress: (req, res) => {
        try {
            let user = req.session.user;
            userProfileHelpers.postAddress(req.body, user.response._id)
                .then((response) => {
                    if (!req.body.newAddress) {
                        res.redirect(`/profile?id=${user.response._id}`)
                    } else {
                        res.redirect('/checkout')
                    }
                })
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { message: 'internal error', error: err });
        }
    },
    deleteAddress: (req, res) => {
        try {
            userProfileHelpers.removeAddress(req.params.id).then((response) => {
                if (response.removed) {
                    res.json({ status: true })
                }
            })
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { message: 'Error ', error: err });
        }
    },
    getPassword: async (req, res) => {
        try {
            const user = req.session.user;
            const count = user ? await cartHelpers.productCount(user.response._id) : 0;
            res.render('user/change-password',
                {
                    user,
                    'invalid': req.session.invalidPassword,
                    'notMatch': req.session.notMatch,
                    count
                });
            req.session.invalidPassword = false;
            req.session.notMatch = false;
            // req.session.updated = false;
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { message: 'internal error', error: err });
        }
    },
    putPassword: (req, res) => {
        try {
            const data = req.session.user;
            userProfileHelpers.changePassword(req.body, data.response).then((response) => {
                let invalid = response.invalidPassword;
                let changed = response.changed;
                let notMatch = response.notMatch;
                if (invalid === true) {
                    req.session.invalidPassword = "Incorrect password";
                    res.redirect('/change-password');
                } else if (notMatch === true) {
                    req.session.notMatch = "password doesn't match !";
                    res.redirect('/change-password');
                } else if (changed === false) {
                    // req.session.updated = "Your password has been updated...";
                    res.redirect('/profile');
                }
            })
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { message: 'internal error', error: err });
        }
    },
    // edit user profile
    editProfile: (req, res) => {
        try {
            let id = req.params.id;
            userProfileHelpers.userProfile(id)
                .then((profile) => {
                    let user = JSON.parse(JSON.stringify(profile));
                    res.render('user/edit-profile', { user, itsUser: true });
                })
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { message: 'Internal error', error: err });
        }
    },
    postEditProfile: (req, res) => {
        try {
            let id = req.params.id;
            let user = req.body;
            userProfileHelpers.postProfile(id, user).then((data) => {
                res.redirect(`/profile?id=${id}`);
            })
        } catch (err) {
            console.error(err);
            res.status(500).send('internal error');
        }
    },

    // get user coupons
    getCoupons: async (req, res) => {
        try {
            const user = req.session.user;
            const userId = user.response._id;
            const count = user ? await cartHelpers.productCount(user.response._id) : 0;
            const coupons = await userProfileHelpers.getCoupons(userId);
            console.log(coupons);
            // const userCoupons = JSON.parse(JSON.stringify(coupons));
            res.render('user/myCoupons', { itsUser: true, user, coupons, count });
        } catch (err) {
            console.log(err);
            res.status(500).send('internal error');
        }
    },

    // getting wallet details
    getWalletDetails: async (req, res) => {
        try {
            const walletTotal = await userProfileHelpers.walletDetails(req.body.userId);
            const cartTotal = await cartHelpers.cartTotal(req.body.userId);
            console.log(walletTotal);
            res.json({ walletTotal, cartTotal });
        } catch (err) {
            console.log(err);
            res.status(500).send('internal error');
        }
    }
} 