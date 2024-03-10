const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const cartController = require('../controller/cartController');

/**
 * @route   /api/cart/
 * @desc    Get the user cart
 * @access  Private
 */
router.get('/', auth, cartController.getUserCart);

/**
 * @route   /api/cart/
 * @desc    Add product to the user cart
 * @access  Private
 */
router.put(
  '/',
  auth,
  [
    body('productId').notEmpty(),
    body('title').notEmpty(),
    body('category').notEmpty(),
    body('price').notEmpty(),
    body('quantity').notEmpty(),
  ],
  cartController.addProductToCart
);

/**
 * @route   /api/cart/increase
 * @desc    Increment a product quantity
 * @access  Private
 */
router.put(
  '/increase',
  auth,
  [body('productId').notEmpty()],
  cartController.increaseQuantity
);

/**
 * @route   /api/cart/decrease
 * @desc    Decerement a product quantity
 * @access  Private
 */
router.put(
  '/decrease',
  auth,
  [body('productId').notEmpty()],
  cartController.decreaseQuantity
);

/**
 * @route   /api/cart/remove
 * @desc    Remove an item from cart
 * @access  Private
 */
router.put(
  '/remove',
  auth,
  [body('productId').notEmpty()],
  cartController.removeItem
);

module.exports = router;
