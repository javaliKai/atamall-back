const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/adminMiddleware');
const adminController = require('../controller/adminController');

/**
 * @route   /api/admin/
 * @desc    Create a new user -- admin
 * @access  Private
 */
router.post(
  '/',
  [
    body('name').trim().not().isEmpty().withMessage('Name should not be empty'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('rePassword')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Re-type must be at least 6 characters long'),
  ],
  adminController.createAdmin
);

/**
 * @route   /api/admin/product
 * @desc    Add a new product
 * @access  Private
 */
router.post(
  '/product',
  auth,
  checkAdmin,
  [
    body('title').trim().notEmpty(),
    body('price').notEmpty().isNumeric(),
    body('description').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('image').trim().notEmpty(),
  ],
  adminController.createProduct
);

/**
 * @route   /api/admin/product/:productId
 * @desc    Add a new product
 * @access  Private
 */
router.delete(
  '/product/:productId',
  auth,
  checkAdmin,
  adminController.deleteProduct
);

/**
 * @route   /api/admin/product/:productId
 * @desc    Edit a product
 * @access  Private
 */
router.put(
  '/product/:productId',
  auth,
  checkAdmin,
  [
    body('title').trim().notEmpty(),
    body('price').notEmpty().isNumeric(),
    body('description').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('image').trim().notEmpty(),
  ],
  adminController.updateProduct
);

/**
 * @route   /api/admin/order/:orderId/deliver
 * @desc    Change the order state to 'delivering'
 * @access  Private
 */
router.put(
  '/order/:orderId/deliver',
  auth,
  checkAdmin,
  adminController.deliverOrder
);

/**
 * @route   /api/admin/analytics/
 * @desc    Get the sales analytics
 * @access  Private
 */
router.get('/analytics', auth, checkAdmin, adminController.getAnalytics);

module.exports = router;
