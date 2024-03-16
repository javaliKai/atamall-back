const Cart = require('../models/Cart');
const mongoose = require('mongoose');
const validateInputReq = require('../util/validation');

exports.getUserCart = async (req, res, next) => {
  try {
    const cartData = await Cart.findOne({
      userId: req.userId,
    });
    return res.status(200).send({ cartData });
  } catch (error) {
    console.error('Error while getting user cart: ', error);
    next(error);
  }
};

exports.addProductToCart = async (req, res, next) => {
  try {
    // get validation result
    const validationErr = validateInputReq(req);
    if (validationErr) {
      return next(validationErr);
    }

    const { productId, title, image, category, price, quantity } = req.body;

    const cartItem = {
      productId,
      title,
      image,
      category,
      price,
      quantity,
    };

    // check whether user cart exists
    const userCart = await Cart.findOne({ userId: req.userId });

    // add new item to cart if exist, create a new entry otherwise
    if (userCart) {
      // check whether product exist in cart, if yes then add +1 to quantity
      const productInCart = userCart.products.find(
        (product) => product.productId.toString() === productId
      );
      if (productInCart) {
        const updatedProduct = {
          ...productInCart,
          quantity: productInCart.quantity + 1,
        };

        const updatedProducts = userCart.products.filter(
          (product) => product.productId.toString() !== productId
        );
        updatedProducts.push(updatedProduct);
        userCart.products = updatedProducts;
      } else {
        userCart.products.push(cartItem);
      }
      await userCart.save();

      return res.status(200).send({ userCart });
    } else {
      const newUserCart = new Cart({
        userId: req.userId,
        products: [cartItem],
      });

      await newUserCart.save();
      return res.status(200).send({ newUserCart });
    }
  } catch (error) {
    console.error('Error while adding product to cart: ', error);
    next(error);
  }
};

exports.increaseQuantity = async (req, res, next) => {
  try {
    // get validation result
    const validationErr = validateInputReq(req);
    if (validationErr) {
      return next(validationErr);
    }

    const { productId } = req.body;
    const userCart = await Cart.findOne({ userId: req.userId });

    const productInCart = userCart.products.find(
      (product) => product.productId.toString() === productId
    );

    if (!productInCart) {
      const error = new Error(`No product found with ID ${productId} in cart.`);
      error.status = 422;
      return next(error);
    }

    const updatedProduct = {
      ...productInCart,
      quantity: productInCart.quantity + 1,
    };

    const updatedProducts = userCart.products.filter(
      (product) => product.productId.toString() !== productId
    );
    updatedProducts.push(updatedProduct);
    userCart.products = updatedProducts;

    await userCart.save();

    return res.status(200).send({ userCart });
  } catch (error) {
    console.error('Error while adding product to cart: ', error);
    next(error);
  }
};

exports.decreaseQuantity = async (req, res, next) => {
  try {
    // get validation result
    const validationErr = validateInputReq(req);
    if (validationErr) {
      return next(validationErr);
    }

    const { productId } = req.body;
    const userCart = await Cart.findOne({ userId: req.userId });

    const productInCart = userCart.products.find(
      (product) => product.productId.toString() === productId
    );

    if (!productInCart) {
      const error = new Error(`No product found with ID ${productId} in cart.`);
      error.status = 422;
      return next(error);
    }

    // Check whether the quantity is 1, if so then just delete the product
    let updatedProducts;
    if (productInCart.quantity === 1) {
      updatedProducts = userCart.products.filter(
        (product) => product.productId.toString() !== productId
      );
    } else {
      const updatedProduct = {
        ...productInCart,
        quantity: productInCart.quantity - 1,
      };

      updatedProducts = userCart.products.filter(
        (product) => product.productId.toString() !== productId
      );
      updatedProducts.push(updatedProduct);
    }

    userCart.products = updatedProducts;
    await userCart.save();

    return res.status(200).send({ userCart });
  } catch (error) {
    console.error('Error while adding product to cart: ', error);
    next(error);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    // get validation result
    const validationErr = validateInputReq(req);
    if (validationErr) {
      return next(validationErr);
    }

    const { productId } = req.body;

    const userCart = await Cart.findOne({ userId: req.userId });

    const productInCart = userCart.products.find(
      (product) => product.productId.toString() === productId
    );

    if (!productInCart) {
      const error = new Error(`No product found with ID ${productId} in cart.`);
      error.status = 422;
      return next(error);
    }

    const updatedProducts = userCart.products.filter(
      (product) => product.productId.toString() !== productId
    );

    userCart.products = updatedProducts;
    await userCart.save();

    return res.status(200).send({ userCart });
  } catch (error) {
    console.error('Error while trying to remove an item from cart: ', error);
    return next(error);
  }
};

exports.emptyCart = async (req, res, next) => {
  try {
    await Cart.deleteOne({ userId: req.userId });
    const userCart = await Cart.findOne({ userId: req.userId });
    return res.status(200).send({ userCart });
  } catch (error) {
    console.error('Error while emptying cart: ', error);
    return next(error);
  }
};
