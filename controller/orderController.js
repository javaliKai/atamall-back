const validateInputReq = require('../util/validation');
const Order = require('../models/Order');

exports.getUserOrders = async (req, res, next) => {
  try {
    // if admin, then give all orders
    let orders;
    if (req.role === 'admin') {
      orders = await Order.find();
    } else {
      orders = await Order.find({ userId: req.userId });
    }
    return res.status(200).send({ orders });
  } catch (error) {
    console.error('Error getting user orders: ', error);
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
    const { products, paymentMethod, shippingAddress } = req.body;

    // calculate total price
    let totalPrice = 0;
    products.forEach((product) => {
      totalPrice += product.price;
    });
    totalPrice = totalPrice.toFixed(2);

    const newOrder = new Order({
      userId,
      products,
      totalPrice,
      paymentMethod,
      shippingAddress,
      status: 'processing',
    });

    await newOrder.save();

    return res.status(200).send({ newOrder });
  } catch (error) {
    console.error('Error creating order: ', error);
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error('No order found with id ' + orderId);
      error.status = 422;
      return next(error);
    }

    order.status = 'cancelled';
    order.finishedDate = new Date();
    await order.save();

    return res.status(200).send({ order });
  } catch (error) {
    console.error('Error cancelling order: ', error);
    next(error);
  }
};

exports.finishOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error('No order found with id ' + orderId);
      error.status = 422;
      return next(error);
    }

    order.status = 'finished';
    order.finishedDate = new Date();
    await order.save();

    return res.status(200).send({ order });
  } catch (error) {
    console.error('Error finishing order: ', error);
    next(error);
  }
};
