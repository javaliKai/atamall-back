const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Address = mongoose.model('address', AddressSchema);
