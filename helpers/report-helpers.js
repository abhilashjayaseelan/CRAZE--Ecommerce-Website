const { orders, products } = require('../models/connection');


module.exports = {
    // monthly revenue
    getMonthlySales: async () => {
        const monthlySales = await orders.aggregate([
            {
                $match: {
                    orderStatus: "recieved"
                }
            },
            {
                $project: {
                    totalPrice: 1,
                    createdAt: 1
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$createdAt"
                        }
                    },
                    totalSales: {
                        $sum: "$totalPrice"
                    }
                }
            }
        ])
        return monthlySales;
    },
    // total revenue
    calculateTotalRevenue: async () => {
        const totalRevenue = await orders.aggregate([
            { $match: { orderStatus: "recieved" } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
        ])
        return totalRevenue[0].totalRevenue;

    },
    // total orders
    calculateTotalOrders: async () => {
        const totalOrders = await orders.aggregate([
            { $match: { orderStatus: "recieved" } },
            { $count: "totalOrders" }
        ])
        return totalOrders[0].totalOrders;
    },
    // total number of products
    calculateTotalNumberOfProducts: async () => {
        const totalProducts = await products.aggregate([
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: "$totalQty" }
                }
            }
        ])
        return totalProducts[0].totalProducts;
    }

}