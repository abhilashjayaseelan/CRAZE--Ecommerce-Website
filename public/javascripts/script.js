
// add product to cart
function addToCart(productId) {
    // console.log('clicked');
    $.ajax({
        url: `/add-to-cart/${productId}`,
        method: 'get',
        success: (res) => {
            // console.log('got here');
            if (res.status) {
                console.log('got to script');
                swal({
                    title: "Successfull!",
                    text: `Product added to cart`,
                    icon: "success",
                    button: "Ok!",
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
    console.log('clicked');
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
                }).then(()=>[
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
            if( res.status){
                swal({
                    title: "Successfull!",
                    text: `Address successfully removed`,
                    icon: "success",
                    button: "Ok!",
                }).then(()=>[
                    location.reload()
                ])
            }
        }
    })
}