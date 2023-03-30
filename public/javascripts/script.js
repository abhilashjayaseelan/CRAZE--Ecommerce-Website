
// add product to cart
function addToCart(productId, quantity) {
    console.log(quantity);
    if (quantity == 0) {
        swal({
            title: "Out of Stock",
            text: `This product is currently out of stock`,
            icon: "warning",
            button: "Ok!",
        });
        return;
    }
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
                    .then(() => {
                        location.reload();
                    })
            } else {
                window.location.href = '/login'
            }
        }
    })
}


// changing cart product quantities
function changeQuantity(cartId, prodId, userId, count, slug) {
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
                let newQuantity = parseInt(document.getElementById(prodId).innerHTML);
                if (newQuantity === 1) {
                    document.getElementById(slug).disabled = true;
                } else {
                    document.getElementById(slug).disabled = false;
                }
            }
        }
    })
}

// delete product from the user cart
function removeProduct(productId) {
    // Display confirmation swal alert
    swal({
        title: "Are you sure?",
        text: "You won't be able to undo this action!",
        icon: "warning",
        buttons: ["Cancel", "Yes, delete it"],
        dangerMode: true,
    }).then((confirmDelete) => {
        if (confirmDelete) {
            // User clicked "Yes, delete it", proceed with removing the product
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
        } else {
            // User clicked "Cancel", do nothing
            return false;
        }
    });
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
                location.replace('/landing-page');
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
    // Display confirmation swal alert
    swal({
        title: "Are you sure?",
        text: "You won't be able to undo this action!",
        icon: "warning",
        buttons: ["Cancel", "Yes, remove it"],
        dangerMode: true,
    }).then((confirmRemove) => {
        if (confirmRemove) {
            // User clicked "Yes, remove it", proceed with removing the product
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
        } else {
            // User clicked "Cancel", do nothing
            return false;
        }
    });
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

