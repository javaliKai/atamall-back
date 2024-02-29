const express = require('express');
const router = express.Router();

const productController = require('../controller/productController');

/**
 * @route   /api/product/populate
 * @desc    Populate database with products
 * @access  Dev
 */
router.put('/populate', productController.populateProducts);

/**
 * @route   /api/product/
 * @desc    Get all products
 * @access  Public
 */
router.get('/', productController.getAllProducts);

module.exports = router;
