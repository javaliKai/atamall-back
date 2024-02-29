const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
const auth = require('../middleware/authMiddleware');
const { body } = require('express-validator');

/**
 * @route   /api/order/
 * @desc    Get all orders
 * @access  Dev
 */
router.get('/', orderController.getAllOrders);

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
    body('products').custom((products) => products.length >= 1),
    body('totalPrice').notEmpty().isNumeric(),
    body('status').notEmpty(),
    body('status')
      .custom(
        (status) =>
          status === 'finished' ||
          status === 'failed' ||
          status === 'processing' ||
          status === 'delivering' ||
          status === 'delivered'
      )
      .withMessage(
        'Invalid status value, should be either finished, failed, processing, delivering, or delivered.'
      ),
  ],
  orderController.createOrder
);

module.exports = router;
