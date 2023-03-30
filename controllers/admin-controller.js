const adminHelper = require('../helpers/admin-helpers');
const reportHelpers = require('../helpers/report-helpers');
const generateReport = require('../public/javascripts/generate-report');
const fs = require('fs');

module.exports = {
    adminDashboard: async (req, res) => {
        try {
            const [monthlySales, users, orders, products] = await Promise.all([
                reportHelpers.getMonthlySales(),
                reportHelpers.calculateTotalUsers(),
                reportHelpers.calculateTotalOrders(),
                reportHelpers.calculateTotalNumberOfProducts()
            ]);
            // console.log(`Total products: ${products}`);
            const totalSales = monthlySales[0] ? monthlySales[0].totalSales : 0;
            // getting details sales graph
            const monthlyOrders = await reportHelpers.monthlyOrders();
            const monthlyOrdersArray = monthlyOrders.map(obj => obj.count);
            // getting details for pie chart
            const categoryWise = await reportHelpers.categoryWise();
            console.log(categoryWise);
            const cateWise = Object.values(categoryWise);

            res.render('admin/admin-dashboard', { admin: true, totalSales, users, orders, products, monthlyOrdersArray, cateWise });
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    },
    // admin login
    getAdminLogin: (req, res) => {
        res.render('admin/admin-login', { 'emailErr': req.session.emailErr, 'pswdErr': req.session.pswdErr });
        req.session.emailErr = false;
        req.session.pswdErr = false;
    },
    postAdminLogin: async (req, res) => {
        try {
            const response = await adminHelper.adminLogin(req.body);
            if (response.status) {
                req.session.adminLoggedIn = true;
                req.session.admin = response.admin;
                res.redirect('/admin/dashboard');
            } else if (response.notExist) {
                req.session.emailErr = "Invalid Email";
                res.redirect('/admin');
            } else {
                req.session.pswdErr = "Invalid Password";
                res.redirect('/admin');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    },
    // admin logout
    getAdminLogout: (req, res) => {
        req.session.admin = false;
        res.redirect('/admin');
    },
    // view users
    viewUsers: async (req, res) => {
        try {
            const users = await adminHelper.getUsers();
            const parsedUsers = JSON.parse(JSON.stringify(users));
            res.render('admin/admin-allUsers', { user: parsedUsers, admin: true });
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    },
    // getting user orders
    getuserOrders: (req, res) => {
        try {
            adminHelper.getOrders().then((orderDetails) => {
                const allOrders = orderDetails.reverse();
                res.render('admin/admin-allOrders', { admin: true, allOrders });
            })

        } catch (err) {
            console.log(err);
            res.status(500).send('internal server error');
        }
    },
    // search orders
    searchOrders: (req, res) => {
        try {
            const orderId = req.body.orderId;
            adminHelper.searchOrder(orderId).then((allOrders) => {
                allOrders = JSON.parse(JSON.stringify(allOrders))
                res.render('admin/admin-allOrders', { admin: true, allOrders });
            })
        } catch (err) {
            console.log(err);
            res.status(500).send('internal server error');
        }
    },
    // order details
    getOrderDetails: async (req, res) => {
        try {
            let productId = req.params.id;
            let status = JSON.parse(JSON.stringify(req.query.status));
            // console.log(status);
            let singleDetails = await adminHelper.singleOrder(productId);
            adminHelper.orderDetails(productId).then((details) => {
                details = JSON.parse(JSON.stringify(details));
                res.render('admin/order-details', { admin: true, details, singleDetails, status });
            })
        } catch (err) {
            console.log(err);
            res.status(500).send('internal server error');
        }
    },
    // change order status 
    changeOrderStatus: async (req, res) => {
        try {
            await adminHelper.changeStatus(req.body);
            res.json({ status: true });
        } catch (err) {
            console.log(err);
            res.json({ status: false });
        }
    },
    // get report page
    getReport: async (req, res) => {
        try {
            const [monthlySales, users, orders, products] = await Promise.all([
                reportHelpers.getMonthlySales(),
                reportHelpers.calculateTotalUsers(),
                reportHelpers.calculateTotalOrders(),
                reportHelpers.calculateTotalNumberOfProducts()
            ]);
            const totalSales = monthlySales[0] ? monthlySales[0].totalSales : 0;
            res.render('admin/sales-report', { admin: true, totalSales, users, orders, products });
        } catch (err) {
            console.log(err);
            res.status(500).send('internal server error');
        }
    },
    // date wise report
    dateWiseReport: async (req, res) => {
        try {
            // getting date wise order details
            const report = await adminHelper.dateWiseReport(req.body);
            const dateWise = JSON.parse(JSON.stringify(report));
            // getting other details
            const [monthlySales, users, orders, products] = await Promise.all([
                reportHelpers.getMonthlySales(),
                reportHelpers.calculateTotalUsers(),
                reportHelpers.calculateTotalOrders(),
                reportHelpers.calculateTotalNumberOfProducts()
            ]);
            const totalSales = monthlySales[0] ? monthlySales[0].totalSales : 0;
            res.render('admin/sales-report', { admin: true, dateWise, totalSales, users, orders, products });
        } catch (err) {
            console.log(err);
            return res.status(400).send('internal error');
        }
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
            salesData.TotalUsers = await reportHelpers.calculateTotalUsers();
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

    },
    // get coupon creation page
    getCoupon: async(req, res) => {
        try {
            const data = await adminHelper.getCoupons();
            const coupons = data.reverse();
            res.render('admin/coupons', { admin: true, coupons });
        } catch (err) {
            console.log(err);
            res.status('500').send('internal error');
        }
    },
    // create new coupon 
    postCoupon: async (req, res) => {
        try {
            adminHelper.createCoupon(req.body).then(() => {
                res.json({ status: true });
            })
        } catch (err) {
            console.log(err);
            res.status('500').send('internal error');
        }
    }
}     