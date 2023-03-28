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
  },
  coupons: [{
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    dateUsed: {
      type: Date,
    },
  }],
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
    type: [String],
    required: true
  },
})

const productSchema = new Schema({
  slug: {
    type: String,
    required: true
  },
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
  images: {
    type: Object,
    required: true
  },
  totalQty: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: false
  },
  discountedPrice: {
    type: Number,
    default: 0,
    required: false
  },
  discountTil: {
    type: Date,
    required: false
  }
})

const discountSchema = new Schema({
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

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
    type: Array,
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

const couponTemplateSchema = new mongoose.Schema({
  discountPercentage: {
    type: Number,
    required: false,
    min: 0,
    max: 100,
  },
  maxDiscountAmount: {
    type: Number,
    required: false,
    min: 0,
  },
  minAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: false
  }
});

const userCouponSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  couponTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CouponTemplate',
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  minAmount: {
    type: Number,
    required: false
  },
  maxDiscountAmount: {
    type: Number,
    required: false
  },
  discountPercentage: {
    type: Number,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: false
  }
});



module.exports.user = mongoose.model('user', userSchema);
module.exports.admin = mongoose.model('admin', adminSchema);
module.exports.category = mongoose.model('category', categorySchema);
module.exports.products = mongoose.model('products', productSchema);
module.exports.address = mongoose.model('address', addressSchema);
module.exports.cart = mongoose.model('cart', cartSchema);
module.exports.orders = mongoose.model('orders', ordersSchema);
module.exports.wishlist = mongoose.model('wishlist', wishlistSchema);
module.exports.wallet = mongoose.model('wallet', walletSchema);
module.exports.discount = mongoose.model('discount', discountSchema);
module.exports.couponTemplateSchema = mongoose.model('couponTemplateSchema', couponTemplateSchema);
module.exports.userCouponSchema = mongoose.model('userCouponSchema', userCouponSchema);