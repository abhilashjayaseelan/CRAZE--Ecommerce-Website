const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => (console.log('connected to database')))
  .catch((err) => { console.log(err); })

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  blocked: {
    type: Boolean,
    default: false
  }
})

const adminSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  }
})

const productSchema = new Schema({
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  name: {
    type: String,
    require: true
  },
  brand: {
    type: String,
    require: true
  },
  color: {
    type: String,
    require: true
  },
  size: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  totalQty: {
    type: Number,
    required: true
  },
  // images: {
  //   type: Buffer,
  //   required: true
  // }
})

const addressSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  pincode: {
    type: Number,
    required: true
  },
  locality: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
})

const cartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  products: {
    type: Array,
    required: true
  }

})

const ordersSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  deliveryAddress: {
    type: Object,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  products: {
    type: Object,
    required: true
  },
  paymentStatus: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now 
  },
  orderStatus: {
    type: String,
    required: true
  },
  paymentMothod: {
    type: String,
    required: true
  }
})

const wishlistSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  products: {
    type:Array,
    required: true
  }
})

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  transactions: {
    type: [Object],
    default: []
  }
})



module.exports.user = mongoose.model('user', userSchema);
module.exports.admin = mongoose.model('admin', adminSchema);
module.exports.category = mongoose.model('category', categorySchema);
module.exports.products = mongoose.model('products', productSchema);
module.exports.address = mongoose.model('address', addressSchema);
module.exports.cart = mongoose.model('cart', cartSchema);
module.exports.orders = mongoose.model('orders', ordersSchema);
module.exports.wishlist = mongoose.model('whishlist', wishlistSchema);
module.exports.wallet = mongoose.model('wallet', walletSchema);