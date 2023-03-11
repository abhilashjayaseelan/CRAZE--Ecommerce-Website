const { orders } = require('../models/connection');


module.exports = {
    getMonthlySales: async() => {
        const monthlySales = await orders.aggregate([
            {
                $match: {
                    orderStatus: "placed" 
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
    }
}