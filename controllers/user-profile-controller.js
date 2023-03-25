const { response } = require('../app');
const userProfileHelpers = require('../helpers/user-profile-helpers');
const { user } = require('../models/connection');

module.exports = {
    getProfile: (req, res) => {
        let id = req.query.id;
        req.session.id = req.params.id;
        userProfileHelpers.userProfile(id)
            .then((profile) => {
                req.session.profile = profile;
                let user = JSON.parse(JSON.stringify(profile));
                res.render('user/profile', { user, itsUser: true });
            })
            .catch((err) => {
                console.log(err);
            })
    },
    getAddress: (req, res) => {
        const user = req.session.user;
        res.render('user/address', { user })
    },
    postAddress: (req, res) => {
        console.log(req.body);
        let user = req.session.user;
        userProfileHelpers.postAddress(req.body, user.response._id)
            .then((response) => {
                if (!req.body.newAddress) {
                    res.redirect(`/profile?id=${user.response._id}`)
                } else {
                    res.redirect('/checkout')
                }
            })
            .catch((err) => {
                console.log(err);
            })
    },
    deleteAddress: (req, res) => {
        userProfileHelpers.removeAddress(req.params.id).then((response) => {
            if (response.removed) {
                res.json({ status: true })
            }
        })
            .catch((err) => {
                console.log(err);
            })
    },
    getPassword: (req, res) => {
        const user = req.session.user;
        res.render('user/change-password',
            {
                user,
                'invalid': req.session.invalidPassword,
                'notMatch': req.session.notMatch
            });
        req.session.invalidPassword = false;
        req.session.notMatch = false;
        // req.session.updated = false;
    },
    putPassword: (req, res) => {
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
            .catch((err) => {
                console.log(err);
            })
    },
    // edit user profile
    editProfile: (req, res) => {
        let id = req.params.id;
        userProfileHelpers.userProfile(id)
            .then((profile) => {
                let user = JSON.parse(JSON.stringify(profile));
                res.render('user/edit-profile', { user, itsUser: true });
            })
            .catch((err) => {
                console.log(err);
            })

    },
    postEditProfile: (req, res) => {
        let id = req.params.id;
        let user = req.body;
        userProfileHelpers.postProfile(id, user).then((data) => {
            res.redirect(`/profile?id=${id}`);
        })
            .catch((err) => {
                console.log(err);
            })
    },

    // get user coupons
    getCoupons: async(req, res) =>{
        try {
            const user = req.session.user;
            const userId = user.response._id;
            const coupons = await userProfileHelpers.getCoupons(userId);
            console.log(coupons);
            // const userCoupons = JSON.parse(JSON.stringify(coupons));
            res.render('user/myCoupons', {itsUser: true, user, coupons});
        } catch (err) {
            console.log(err);

        }
    }
} 