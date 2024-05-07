const validateInputReq = require('../util/validation');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.createAdmin = async (req, res, next) => {
  try {
    // Validation
    const errors = validateInputReq(req);
    if (errors) {
      return next(errors);
    }

    const { name, email, password, rePassword } = req.body;

    // extra validation: compare password and retype password
    const rePasswordMatch = password === rePassword;
    if (!rePasswordMatch) {
      const error = new Error('Re-type password does not match.');
      error.status = 422;
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email is already registered.');
      error.status = 422;
      return next(error);
    }

    // hash password
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone: '',
      role: 'admin',
    });

    await newUser.save();

    return res.status(200).send({ newUser });
  } catch (error) {
    console.error('Error creating admin: ', error);
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    // Validation
    const errors = validateInputReq(req);
    if (errors) {
      return next(errors);
    }

    const newProductData = req.body;

    const newProduct = new Product({
      ...newProductData,
    });

    await newProduct.save();

    return res.status(200).json({ newProduct });
  } catch (error) {
    console.error('Error creating new product: ', error);
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const deleteResult = await Product.deleteOne({ _id: productId });

    return res.status(200).json({ deleteResult });
  } catch (error) {
    console.error('Error deleting product: ', error);
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    // Validation
    const errors = validateInputReq(req);
    if (errors) {
      return next(errors);
    }

    const { productId } = req.params;

    // check whether the product exist
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Invalid productId');
      error.status = 422;
      return next(error);
    }

    const { title, price, description, category, image } = req.body;
    product.title = title;
    product.price = price;
    product.description = description;
    product.category = category;
    product.image = image;

    await product.save();

    return res.status(200).json({ updatedProduct: product });
  } catch (error) {
    console.error('Error updating product: ', error);
    next(error);
  }
};

exports.deliverOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error('Invalid order id.');
      error.status = 422;
      return next(error);
    }

    // modify the status to 'delivering'
    order.status = 'delivering';

    await order.save();

    return res.status(200).json({ order });
  } catch (error) {
    console.error('Error while delivering order: ', error);
    next(error);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    // Get all compeleted orders
    const completedOrders = await Order.find({ status: 'finished' });

    // Caclulate parameters:  Items sold, revenue, most sold category, most sold product
    let totalItemsSold = 0;
    let revenue = 0;
    const soldCategory = {};
    const soldProduct = {};

    completedOrders.forEach((order) => {
      order.products.forEach((product) => {
        totalItemsSold += product.quantity;
        // calculate category sold
        if (!soldCategory[product.category]) {
          soldCategory[product.category] = 1 * product.quantity;
        } else {
          soldCategory[product.category] += 1 * product.quantity;
        }

        // calculate product sold
        if (!soldProduct[product.title]) {
          soldProduct[product.title] = 1 * product.quantity;
        } else {
          soldProduct[product.title] += 1 * product.quantity;
        }
      });
      revenue += order.totalPrice;
    });
    // Accept only 2 digits floating point
    revenue = Math.round(revenue * 100) / 100;

    // Calculate most sold category and products
    let mostSoldCategory = undefined;
    let maxSoldCat = 0;
    for (const category in soldCategory) {
      if (soldCategory[category] > maxSoldCat) {
        mostSoldCategory = category;
        maxSoldCat = soldCategory[category];
      }
    }
    let mostSoldProduct = undefined;
    let maxSoldProd = 0;
    for (const product in soldProduct) {
      if (soldProduct[product] > maxSoldProd) {
        mostSoldProduct = product;
        maxSoldProd = soldProduct[product];
      }
    }

    return res.status(200).json({
      totalItemsSold,
      revenue,
      soldCategory,
      mostSoldCategory,
      soldProduct,
      mostSoldProduct,
    });
  } catch (error) {
    console.error('Error while getting analytics: ', error);
    next(error);
  }
};
