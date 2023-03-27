
// add product to cart
function addToCart(productId) {
    // console.log('clicked');
    $.ajax({
        url: `/add-to-cart/${productId}`,
        method: 'get',
        success: (res) => {
            // console.log('got here');
            if (res.status) {
                // console.log('got to script');
                swal({
                    title: "Successfull!",
                    text: `Product added to cart`,
                    icon: "success",
                    button: "Ok!",
                })
                .then(()=>{
                    location.reload();
                })
            } else {
                window.location.href = '/login' 
            }
        }
    })
}

// changing cart product quantities
function changeQuantity(cartId, prodId, userId, count) {
    let quantity = parseInt(document.getElementById(prodId).innerHTML)

    $.ajax({
        url: `/change-quantity`,
        data: {
            cart: cartId,
            user: userId,
            product: prodId,
            count: count
        },
        method: 'post',
        success: (res) => {
            if (res.status) {
                console.log(res.total);
                document.getElementById(prodId).innerHTML = quantity + parseInt(count);
                document.getElementById('cart-subtotal').innerHTML = res.total;
                document.getElementById('cart-total').innerHTML = res.total;

            }
        }

    })
}

// delete product from the user cart
function removeProduct(productId) {
    // console.log('clicked');
    $.ajax({
        url: `/delete-from-cart/${productId}`,
        method: 'get',
        success(res) {
            if (res.status) {
                swal({
                    title: "Successfull!",
                    text: `Product removed from cart`,
                    icon: "success",
                    button: "Ok!",
                }).then(() => [
                    location.reload()
                ])
            }
        }
    })
}

// delete address
function deleteAddress(addressId) {
    console.log('clicked');
    $.ajax({
        url: `/delete-address/${addressId}`,
        method: 'get',
        success(res) {
            if (res.status) {
                swal({
                    title: "Successfull!",
                    text: `Address successfully removed`,
                    icon: "success",
                    button: "Ok!",
                }).then(() => [
                    location.reload()
                ])
            }
        }
    })
}

// razorpay payment
function razorPayPayment(orderDetails) {
    console.log(orderDetails);
    var options = {
        key: "rzp_test_dT2hX9gH8hyKFB", // Enter the Key ID generated from the Dashboard
        amount: `${(orderDetails.order.amount) * 100}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "CRAZE", //your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: `${orderDetails.order.id}`, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response) {
            // swal(response.razorpay_payment_id).then(() => {
            //     swal(response.razorpay_order_id).then(() => {
            //         swal(response.razorpay_order_id);
            //     });
            // });
            verifyPayment(response, orderDetails.order);
        },
        prefill: {
            name: "User Name", //your customer's name
            email: "gaurav.kumar@example.com",
            contact: `${orderDetails.response.deliveryAddress.mobile}`,
        },
        notes: {
            address: "Razorpay Corporate Office",
        },
        theme: {
            color: "#3399cc",
        },
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
}

// razorpay payment verification
function verifyPayment(payment, order) {
    // console.log('payment');
    $.ajax({
        url: "/verify-payment",
        data: {
            payment,
            order
        },
        method: 'post',
        success: (response) => {
            if (response.status) {
                location.replace('/orders');
            } else {
                swal({
                    title: "Warning!",
                    text: "Payment failed",
                    icon: "error",
                    button: "Ok!",
                }).then(() => {
                    location.replace('/');
                })
            }
        }
    })
}

// add to wishlist
function addToWishList(productId) {
    $.ajax({
        url: `/add-wishlist?productId=${productId}`,
        method: 'get',
        success: (response) => {
            if (response.status) {
                swal({
                    title: "Successfull!",
                    text: `Product added to wishlist`,
                    icon: "success",
                    button: "Ok!",
                })
            } else {
                window.location.href = '/login'
            }
        }
    })
}

// remove product from wishlist
function removeFromWishlist(productId) {
    $.ajax({
        url: `/remove-from-wishlist?productId=${productId}`,
        method: 'get',
        success: (response) => {
            if (response.status) {
                swal({
                    title: "Successfull!",
                    text: `Product removed from wishlist`,
                    icon: "success",
                    button: "Ok!",
                }).then(() => [
                    location.reload()
                ])
            }
        }
    })
}

// cancel order
function cancelOrder(orderId) {
    console.log(orderId)
    $.ajax({
        url: "/cancel-order",
        data: {
            orderId: orderId,
        },
        method: 'post',
        success: (res) => {
            swal({
                title: "Order cancelled!!",
                text: `If you already payed the price it will be credited into your wallet shortly..`,
                icon: "success",
                button: "Ok!",
            }).then(() => [
                location.replace('/orders')
            ])
        }
    })
}

// return order
function returnOrder(orderId) {
    console.log(orderId)
    $.ajax({
        url: "/return-order",
        data: {
            orderId: orderId,
        },
        method: 'post',
        success: (res) => {
            swal({
                title: "Return request submitted !!",
                text: `Item will be collected by one our agent within 3 days..`,
                icon: "success",
                button: "Ok!",
            }).then(() => [    
                location.replace('/orders')
            ])
        }
    })
}

