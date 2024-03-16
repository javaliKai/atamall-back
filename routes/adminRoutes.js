const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controller/adminController');

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
  adminController.createAdmin
);
