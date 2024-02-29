const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const userController = require('../controller/userController');

/**
 * @route   /api/user/
 * @desc    Get all users
 * @access  Dev
 */
router.get('/', userController.getAllUser);

/**
 * @route   /api/user/:userId
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:userId', auth, userController.findUserById);

/**
 * @route   /api/user/trade/token
 * @desc    Get user by token
 * @access  Private
 */
router.get('/trade/token', auth, userController.findUserByToken);

/**
 * @route   /api/user/
 * @desc    Create a new user
 * @access  Public
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
  userController.createUser
);

/**
 * @route   /api/user/address
 * @desc    Create a new address for the user
 * @access  Private
 */
router.post('/address', auth, [
  body('country').trim().notEmpty(),
  body('province').trim().notEmpty(),
  body('state').trim().notEmpty(),
  body('detail').trim().notEmpty(),
  userController.createAddress,
]);

/**
 * @route   /api/user/phone
 * @desc    Modify the phone number of the user
 * @access  Private
 */
router.put(
  '/phone',
  auth,
  [body('phone').notEmpty()],
  userController.updatePhone
);

/**
 * @route   /api/user/address/:addressId
 * @desc    Modify the address based on the given addressId
 * @access  Private
 */
router.put(
  '/address/:addressId',
  auth,
  [
    body('country').trim().notEmpty(),
    body('province').trim().notEmpty(),
    body('state').trim().notEmpty(),
    body('detail').trim().notEmpty(),
  ],
  userController.updateAddress
);

/**
 * @route   /api/user/name
 * @desc    Modify user basic information i.e. name
 * @access  Private
 */
router.put(
  '/name',
  auth,
  [body('name').trim().notEmpty()],
  userController.updateName
);

/**
 * @route   /api/user/wishlist/all
 * @desc    Get all user's wishlist
 * @access  Private
 */
router.get('/wishlist/all', auth, userController.getAllWishlist);

/**
 * @route   /api/user/wishlist
 * @desc    Get all user's wishlist
 * @access  Private
 */
router.post(
  '/wishlist',
  auth,
  [body('productId').trim().notEmpty()],
  userController.createWishlist
);

/**
 * @route   /api/user/wishlist/:productId
 * @desc    Delete a user wishlist
 * @access  Private
 */
router.delete('/wishlist/:productId', auth, userController.deleteWishlist);

module.exports = router;
