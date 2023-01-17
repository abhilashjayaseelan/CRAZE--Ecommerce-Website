const ObjectId = require('mongodb').ObjectId;
const { ReturnDocument } = require('mongodb');
const { cart, user } = require('../models/connection');

module.exports = {
    toCart: (productId, userId) => {
        const productObj = {
            item: ObjectId(productId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            try {
                const userCart = await cart.findOne({ userId: ObjectId(userId) });
                if (userCart) {
                    const prodExist = userCart.products.findIndex(products => products.item == productId)
                    if (prodExist != -1) {
                        cart.updateOne({ userId: ObjectId(userId), 'products.item': ObjectId(productId) },
                            {
                                $inc: { 'products.$.quantity': 1 }
                            }
                        ).then(() => {
                            resolve({ status: true });
                        })
                    }
                    else {
                        await cart.updateOne({ userId: ObjectId(userId) }, { $push: { products: productObj } })
                        resolve({ status: true })
                    }
                }
                else {

                    const data = new cart({
                        userId: ObjectId(userId),
                        products: [productObj]
                    })
                    await data.save();
                    console.log(data);
                    resolve({ status: true });
                }
            } catch (error) {
                console.log('got rejected');
                reject(error);
            }
        })
    },
    getCartItems: async (userId) => {
        try {
            const cartItems = await cart.aggregate([
                {
                    $match: { userId: ObjectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                },
            ]);
            return cartItems;
        } catch (error) {
            console.log(error);
            return [];
        }
    },
    changeQuantity: (details) => {
        details.count = parseInt(details.count)
        return new Promise((resolve, reject) => [
            cart.findOneAndUpdate({ _id: ObjectId(details.cart), 'products.item': ObjectId(details.product) },
                {
                    $inc: { 'products.$.quantity': details.count }
                }).then((data) => {
                    resolve(data.products[0].quantity)
                })
        ])
    },
    removeProduct: (uId, pId) =>{
        const userId = ObjectId(uId);
        const productId = ObjectId(pId);

        return new Promise( async(resolve, reject) =>{
            cart.findOneAndUpdate({userId: userId},
            {
                $pull:{ products:{item: productId} }
            })
            .then((response)=>{
                if(response){
                    resolve({removed: true})
                }else{
                    reject(error)
                }
            })
            .catch((err)=>{
                console.log(err);   
            })
        })
    },
    cartTotal: async(userId)=>{
        try {
            const cartTotal = await cart.aggregate([
                {
                    $match: { userId: ObjectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }

                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {$sum:{$multiply:['$quantity', '$product.price']}}
                    }
                }
            ]);
            return cartTotal[0].total;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

}