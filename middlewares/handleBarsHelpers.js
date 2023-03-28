// helper functions for the hbs files
module.exports = {
    formatDate: function (dateString) {
        const date = new Date(dateString)
        const options = { month: "long", day: "numeric", year: "numeric" }
        return date.toLocaleDateString("en-US", options)
    },
    inc: (value) => {
        return parseInt(value) + 1
    },
    eq: (a, b) => {
        return a === b
    },
    or: function (a, b, options) {
        if (a || b) {
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    },
    not: function (value) {
        return !value
    },
    multiply: (a, b) => {
        return a * b
    },
    subtract: (a, b) => {
        return a - b
    },
    notNull: (value, options) => {
        if (value !== null) {
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    },
    JSONstringify: (obj) => {
        return JSON.stringify(obj)
    },
    formatCurrency: (value) => {
        // Check if value is a number
        if (isNaN(value)) {
            return ""
        }
        // Format the value into a currency string with INR symbol
        const formatter = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        })
        return formatter.format(value)
    },
    stock: (quantity) => {
        return quantity > 0;
    },
    index: (index) => {
        return index + 1;
    },
    prices: (actual, discount) => {
        if (!discount || discount === 0) {
            return actual;
        } else {
            return discount;
        }
    },
    oldprice: (actual, discount) => {
        return discount > 0;
    },
    productStatus: (quantity) =>{
        return quantity > 0;
    },
    // add more helper functions here...
}
