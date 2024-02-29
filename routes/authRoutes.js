const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controller/authController');

/**
 * @route   /api/auth/signin
 * @desc    Sign user in and get token
 * @access  Public
 */
router.post(
  '/signin',
  [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  authController.signIn
);

module.exports = router;
