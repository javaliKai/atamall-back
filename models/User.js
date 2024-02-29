const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    required: true,
  },
  address: [{ type: mongoose.Schema.Types.ObjectId, ref: 'address' }],
  order: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'order',
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'wishlist',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model('user', UserSchema);
