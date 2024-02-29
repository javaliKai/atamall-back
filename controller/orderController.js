const validateInputReq = require('../util/validation');
const Order = require('../models/Order');

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    return res.status(200).send({ orders });
  } catch (error) {
    console.error('Error getting all orders: ', error);
    next(error);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    // Validation
    const errors = validateInputReq(req);
    if (errors) {
      return next(errors);
    }

    const userId = req.userId;
    const { products, totalPrice, status } = req.body;

    if (totalPrice < 0) {
      const error = new Error('Invalid total price, should not be negative.');
      error.status = 422;
      return next(error);
    }

    const newOrder = new Order({
      userId,
      products,
      totalPrice,
      status,
    });

    await newOrder.save();

    return res.status(200).send({ newOrder });
  } catch (error) {
    console.error('Error creating order: ', error);
    next(error);
  }
};
