const { user, address, userCouponSchema, wallet } = require('../models/connection')
const bcrypt = require('bcrypt');
const objectId = require('mongodb').ObjectId

module.exports = {
    userProfile: (userId) => {
        try {
            return Promise.all([
                user.findOne({ _id: objectId(userId) }),
                address.find({ userId: objectId(userId) })
            ]).then(([userData, addressData]) => {
                return { userData, addressData }
            })
        } catch (err) {
            console.log(err);
            return err;
        }
    },
    postAddress: async (addressData, id) => {
        console.log("kkjgkgk",addressData);
        const { name, mobile, pincode, locality, area, district, state } = addressData;
        const data = new address({
            name,
            mobile,
            pincode,
            locality,
            area,
            district,
            state,
            userId: id,
        });
        try {
            await data.save();
            return data;
        } catch (err) {
            return err;
        }
    },
    removeAddress: (addressId) => {
        return new Promise((resolve, reject) => {
            address.deleteOne({ _id: objectId(addressId) }).then((response) => {
                // console.log(response);
                // console.log(addressId)
                if (response) {

                    resolve({ removed: true })
                } else {
                    reject(new Error('Address not found'))
                }
            })
                .catch((err) => {
                    reject(err)
                })
        })
    },
    getAddress: (userId) => {
        return new Promise((resolve, reject) => {
            address.find({ userId: objectId(userId) }).then((address) => {
                if (address) {
                    resolve(address);
                } else {
                    reject(new Error('No address found for the user'));
                }
            })
        })
    },
    changePassword: async (inputData, userData) => {
        const match = await bcrypt.compare(inputData.password, userData.password);
        if (!match) {
            return { invalidPassword: true };
        } else if (inputData.newPassword !== inputData.confirmPassword) {
            return { notMatch: true };
        } else {
            try {
                const hashedPassword = await bcrypt.hash(inputData.newPassword, 10);
                const result = await user.updateOne({ email: userData.email }, { $set: { password: hashedPassword } });
                if (result.nModified === 1) {
                    return { changed: true };
                } else {
                    return { changed: false };
                }
            } catch (err) {
                return { error: err.message };
            }
        }
    },
    //edit user profile
    postProfile: (userId, userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                await user.updateOne({ _id: userId }, {
                    $set: {
                        'name': userData.name,
                        'email': userData.email,
                        'mobile': userData.mobile,
                    }
                })
                resolve();
            } catch (err) {
                reject(err);
            }
        })
    },

    // get user coupons
    getCoupons: async (userId) => {
        console.log("userId: ", userId);
        try {
            const coupons = await userCouponSchema.find({ userId: objectId(userId) }).lean();
            // console.log("coupon", coupons);
            return coupons;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    // deducting payment amount from wallet
    walletPayment: async (userId, orderDetails) => {
        try {
            const tranObj = {
                orderId: orderDetails.orderId,
                amount: orderDetails.totalPrice,
                date: new Date(),
                type: 'debit'
            }
            console.log('here', tranObj);
            const newWallet = await wallet.findOne({ userId: objectId(userId) })
            if (newWallet) {
                newWallet.balance -= orderDetails.totalPrice;
                newWallet.transactions.push(tranObj)
            }
            await newWallet.save();
            return newWallet;
        } catch (err) {
            console.log(err);
            return err;
        }
    },

    // getting wallet details
    walletDetails: async (userId) => {
        try {
            const details = await wallet.find({ userId: objectId(userId) }).lean();
            return details[0].balance;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

}

