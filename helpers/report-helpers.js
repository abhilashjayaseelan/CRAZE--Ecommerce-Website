const { orders, products, user } = require('../models/connection');
const util = require('util');


module.exports = {
    // monthly revenue
    getMonthlySales: async () => {
        try {
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
        } catch (err) {
            console.log(err);
            return err;
        }
    },
    // total revenue
    calculateTotalUsers: async () => {
        try {
            const count = await user.countDocuments();
            return count;
        } catch (error) {
            console.error(error);
            throw new Error('Error calculating total number of Users');
        }
    },
    // total orders
    calculateTotalOrders: async () => {
        try {
            const totalOrders = await orders.aggregate([
                { $match: { orderStatus: "recieved" } },
                { $count: "totalOrders" }
            ])
            const totalOrd = totalOrders[0] ? totalOrders[0].totalOrders : 0;
            return totalOrd;
        } catch (err) {
            console.log(err);
            return err;
        }
    },
    // total number of products
    calculateTotalNumberOfProducts: async () => {
        try {
            const count = await products.countDocuments();
            return count;
        } catch (error) {
            console.error(error);
            throw new Error('Error calculating total number of products');
        }
    },
    // collect data for the graphs
    monthlyOrders: async () => {
        try {
            const pipeline = [
                {
                    $group: {
                        _id: {
                            $month: "$createdAt"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id",
                        count: "$count"
                    }
                },
                {
                    $sort: {
                        month: 1
                    }
                }
            ];
            // Execute the aggregation pipeline
            const results = await orders.aggregate(pipeline);
            // Create an array of 12 months with 0 orders
            const months = Array.from({ length: 12 }, (_, i) => ({
                month: i + 1,
                count: 0
            }));
            // Merge the results with the months array
            const ordersByMonth = months.map((m) => {
                const monthResult = results.find((r) => r.month === m.month);
                return monthResult ? monthResult : m;
            });
            return ordersByMonth;
        } catch (err) {
            console.log(err);
            return err;
        }
    },

    // category wise total
    categoryWise: async () => {
        try {
            const result = await products.aggregate([
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                }
            ]);
            const countByCategory = {};
            result.forEach(item => {
                countByCategory[item._id] = item.count;
            });
            return countByCategory;
        } catch (err) {
            console.log(err);
            return err;
        }
    }


}