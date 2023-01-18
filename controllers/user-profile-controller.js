const { response } = require('../app');
const userProfileHelpers = require('../helpers/user-profile-helpers');

module.exports = {
    getProfile: (req, res)=>{
        let id = req.params.id;
        req.session.id = req.params.id;
        userProfileHelpers.userProfile(id)
        .then((profile)=>{
            console.log(profile);
            req.session.profile = profile;
            let user = JSON.parse(JSON.stringify(profile))
            res.render('user/profile', { user, itsUser: true });
        })
        .catch((err)=>{
            console.log(err);
        })
    },
    getAddress: (req, res) =>{
        const user = req.session.user;
        res.render('user/address', { user })  
    },
    postAddress: (req, res) =>{
        let user = req.session.user;
        userProfileHelpers.postAddress( req.body, user.response._id )
        .then((response)=>{
            res.redirect(`/profile/${user.response._id}`)
        })
        .catch((err) =>{
            console.log(err);
        })
    },
    deleteAddress: (req, res) =>{
        userProfileHelpers.removeAddress(req.params.id).then((response)=>{
            if(response.removed){
                res.json({ status : true })
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    },
    getPassword: (req, res)=>{
        const user = req.session.user;
        res.render('user/change-password', { user });
    },
    postPassword: ( req, res)=>{
        userProfileHelpers.changePassword().then((response)=>{
            
        })
    }
}