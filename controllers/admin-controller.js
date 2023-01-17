const adminHelper = require('../helpers/admin-helpers');

module.exports = {
    adminDashboard: (req, res) => {
        res.render('admin/admin-dashboard', { admin: true });
    },
    // admin login
    getAdminLogin: (req, res) => {
        res.render('admin/admin-login', { 'emailErr': req.session.emailErr, 'pswdErr': req.session.pswdErr });
        req.session.emailErr = false;
        req.session.pswdErr = false;
    },
    postAdminLogin: (req, res) => {
        adminHelper.adminLogin(req.body).then((response) => {
            if (response.status) {
                req.session.adminLoggedIn = true;
                req.session.admin = response.admin;
                res.redirect('/admin/dashboard');
            } else if (response.noMatch) {
                req.session.emailErr = "Invalid Email"
                res.redirect('/admin');
            } else {
                req.session.pswdErr = "Invalid Password";
                res.redirect('/admin');
            }
        })
    },
    // admin logout
    getAdminLogout: (req, res) => {
        req.session.admin = false;
        res.redirect('/admin');
    },
    // view users
    viewUsers: (req, res) => {
        adminHelper.getUsers().then((user) => {
            user = JSON.parse(JSON.stringify(user))
            res.render('admin/admin-allUsers', { user, admin: true });
        })
    }
    
}     