
// Group the orders by month
(function ($) {
    "use strict";
    /*Sale statistics Chart*/
    if ($('#myChart').length) {
        var salesDataElement = document.getElementById("sales-data");
        var ordersByMonth = salesDataElement.innerHTML;
        let arr = ordersByMonth.split(",").map(x => parseInt(x));
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            // The data for our dataset
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Orders',
                    tension: 0.3,
                    fill: true,
                    backgroundColor: 'rgba(44, 120, 220, 0.2)',
                    borderColor: 'rgba(44, 120, 220)',
                    data: arr
                },
                ]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                        },
                    }
                }
            }
        });
    } //End if

    /*Sale statistics Chart*/
    if ($('#myChart2').length) {
        var categoryElement = document.getElementById("category-data");
        var categoryWise = categoryElement.innerHTML;
        let cat = categoryWise.split(",").map(x => parseInt(x));
        var ctx = document.getElementById("myChart2");
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Women', 'Kid', 'Men'],
                datasets: [{
                    data: cat,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ]
                }]
            },
        });
    }

})(jQuery);