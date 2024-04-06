const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['alipay', 'wechat', 'credit card'],
    required: true,
  },
  shippingAddress: {
    country: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['finished', 'cancelled', 'processing', 'delivering', 'delivered'],
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now(),
  },
  finishedDate: {
    type: Date,
    default: null,
  },
});

module.exports = PurchaseHistory = mongoose.model('order', OrderSchema);
