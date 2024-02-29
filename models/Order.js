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
      name: {
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
  status: {
    type: String,
    enum: ['finished', 'failed', 'processing', 'delivering', 'delivered'],
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
