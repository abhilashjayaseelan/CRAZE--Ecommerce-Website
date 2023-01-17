const { admin, user} = require('../models/connection');
const bcrypt = require('bcrypt');
const { response } = require('../app');

module.exports = {
    adminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let admin1 = await admin.findOne({ email: adminData.email });
            if (admin1) {
                await bcrypt.compare(adminData.password, admin1.password).then((status) => {
                    if (status) {
                        response.admin = admin1;
                        response.status = true;
                        resolve(response)
                    } else {
                        // console.log(status);
                        resolve({ status: false });
                    }
                })
            } else {
                resolve({ notExist: true });
            }
        })
    },
    getUsers: () => {
        return new Promise(async (resolve, reject) => {
            await user.find().then((users) => {
                userDatas = users;
            })
            resolve(userDatas);
        })
    },
    blockUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            await user.updateOne({ _id: userId }, { $set: { blocked: true } }).then((result) => {
                console.log('user blocked');
                resolve(result);
            })
        })
    },
    unblockUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            await user.updateOne({ _id: userId }, { $set: { blocked: false } }).then((result) => {
                console.log('user unblocked');
                resolve(result);
            })
        })
    }
}