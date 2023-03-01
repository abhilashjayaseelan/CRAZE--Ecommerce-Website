const { response } = require('../app');
const { user, address, cart } = require('../models/connection')
const bcrypt = require('bcrypt');
const objectId = require('mongodb').ObjectId

module.exports = {
    userProfile: (userId) => {
        return Promise.all([
            user.findOne({ _id: objectId(userId) }),
            address.find({ userId: objectId(userId) })
        ]).then(([userData, addressData]) => {
            return { userData, addressData }
        })
            .catch((err) => {
                console.log(err);
            })
    },
    postAddress: (addressData, id) => {
        // console.log(addressData);
        return new Promise(async (resolve, reject) => {
            let data = new address({
                'name': addressData.name,
                'mobile': addressData.mobile,
                'pincode': addressData.pincode,
                'locality': addressData.locality,
                'area': addressData.area,
                'district': addressData.district,
                'state': addressData.state,
                'userId': id
            })
            try {
                await data.save()
                resolve(data);
            } catch (err) {
                reject(err);
            }
        })
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
    }

}

