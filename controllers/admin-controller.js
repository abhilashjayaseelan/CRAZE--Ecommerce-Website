const { json } = require('express');
const adminHelper = require('../helpers/admin-helpers');
const reportHelpers = require('../helpers/report-helpers');
const generateReport = require('../public/javascripts/generate-report');
const fs = require('fs');

module.exports = {
    adminDashboard: async(req, res) => {
        const monthlySales = await reportHelpers.getMonthlySales();
        const revenue = await reportHelpers.calculateTotalRevenue();
        const orders = await reportHelpers.calculateTotalOrders();
        const products = await reportHelpers.calculateTotalNumberOfProducts();
            if (monthlySales[0]) {
                let totalSales = monthlySales[0].totalSales;
                res.render('admin/admin-dashboard', { admin: true, totalSales, revenue, orders, products });
            } else {
                let totalSales = 0;
                res.render('admin/admin-dashboard', { admin: true, totalSales, revenue, orders, products });
            }
        
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
    },
    // getting user orders
    getuserOrders: (req, res) => {
        adminHelper.getOrders().then((allOrders) => {
            allOrders = JSON.parse(JSON.stringify(allOrders))
            res.render('admin/admin-allOrders', { admin: true, allOrders });
        })

    },
    // search orders
    searchOrders: (req, res) => {
        const orderId = req.body.orderId;
        adminHelper.searchOrder(orderId).then((allOrders) => {
            allOrders = JSON.parse(JSON.stringify(allOrders))
            res.render('admin/admin-allOrders', { admin: true, allOrders });
        })
    },
    // order details
    getOrderDetails: async (req, res) => {
        let productId = req.params.id;
        let status = JSON.parse(JSON.stringify(req.query.status));
        console.log(status);
        let singleDetails = await adminHelper.singleOrder(productId);
        adminHelper.orderDetails(productId).then((details) => {
            details = JSON.parse(JSON.stringify(details));
            res.render('admin/order-details', { admin: true, details, singleDetails, status });
        })
            .catch((err) => {
                console.log(err);
            })
    },
    // change order status 
    changeOrderStatus: (req, res) => {
        adminHelper.changeStatus(req.body).then((result) => {
            res.json({ status: true });
        })
            .catch((err) => {
                console.log(err);
            })
    },
    // making reports
    makeReport: async (req, res) => {
        const { format } = req.body;
        // Check if format field is present
        if (!format) {
            return res.status(400).send('Format field is required');
        }
        // Generate the sales report using your e-commerce data
        const salesData = {}
        try {
            salesData.TotalRevenue = await reportHelpers.calculateTotalRevenue();
            salesData.TotalOrders = await reportHelpers.calculateTotalOrders();
            salesData.TotalProducts = await reportHelpers.calculateTotalNumberOfProducts();
            salesData.MonthlyEarnings = await reportHelpers.getMonthlySales();
        } catch (err) {
            console.log('Error calculating sales data:', err);
            return res.status(500).send('Error calculating sales data');
        }
        try {
            // Convert the report into the selected file format and get the name of the generated file
            const reportFile = await generateReport(format, salesData);
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

    }

}     