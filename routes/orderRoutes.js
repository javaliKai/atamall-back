const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
const auth = require('../middleware/authMiddleware');
const { body } = require('express-validator');

/**
 * @route   /api/order/
 * @desc    Get all user orders
 * @access  Private
 */
router.get('/', auth, orderController.getUserOrders);

/**
 * @route   /api/order/
 * @desc    Create a new order
 * @access  Private
 */
router.post(
  '/',
  auth,
  [
    body('products').isArray(),
    body('products')
      .custom((products) => products.length >= 1)
      .withMessage('Order cannot be empty.'),
    body('paymentMethod').trim().notEmpty(),
  ],
  orderController.createOrder
);

/**
 * @route   /api/order/cancel/:orderId
 * @desc    Cancel an order
 * @access  Private
 */
router.put('/cancel/:orderId', auth, orderController.cancelOrder);

module.exports = router;
