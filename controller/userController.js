const validateInputReq = require('../util/validation');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Address = require('../models/Address');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.error('Error fetching user: ', error);
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
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
      role: 'customer',
    });

    await newUser.save();

    return res.status(200).send({ newUser });
  } catch (error) {
    console.error('Error creating user: ', error);
    next(error);
  }
};

exports.findUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
      .select('-password')
      .populate({ path: 'address', model: 'address' })
      .populate({ path: 'wishlist', model: 'wishlist' });

    if (!user) {
      const error = new Error('User not found.');
      error.status = 400;
      return next(error);
    }

    return res.status(200).send({ user });
  } catch (error) {
    console.error('Error fetching user by ID: ', error);
    next(error);
  }
};

exports.findUserByToken = async (req, res, next) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId)
      .select('-password')
      .populate({ path: 'address', model: 'address' })
      .populate({ path: 'wishlist', model: 'wishlist' });
    if (!user) {
      const error = new Error('User not found.');
      error.status = 400;
      return next(error);
    }

    return res.status(200).send({ user });
  } catch (error) {
    console.error('Error fetching user by ID: ', error);
    next(error);
  }
};

exports.createAddress = async (req, res, next) => {
  try {
    // Validation
    const errors = validateInputReq(req);
    if (errors) {
      return next(errors);
    }

    // get data from body
    const { country, province, state, detail } = req.body;

    // create new Address model
    const newAddress = new Address({
      userId: req.userId,
      country,
      province,
      state,
      detail,
    });

    const newAddressId = newAddress._id;

    // push new address Id to the user model
    const user = await User.findById(req.userId);
    user.address.push(newAddressId);

    // save changes
    await newAddress.save();
    await user.save();

    return res.status(200).send({ newAddress });
  } catch (error) {
    console.error('Error creating address: ', error);
    next(error);
  }
};

exports.updatePhone = async (req, res, next) => {
  try {
    // Validation
    const errors = validateInputReq(req);
    if (errors) {
      return next(errors);
    }

    const { phone } = req.body;

    const user = await User.findById(req.userId);
    user.phone = phone;

    await user.save();

    return res.status(200).send({ user });
  } catch (error) {
    console.error('Error updating phone: ', error);
    next(error);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    // Validation
    const errors = validateInputReq(req);
    if (errors) {
      return next(errors);
    }

    const addressId = req.params.addressId;
    const { country, province, state, detail } = req.body;

    // grab the corresponding address object
    const currentAddress = await Address.findById(addressId);
    if (!currentAddress) {
      const error = new Error('Invalid addressId.');
      error.status = 401;
      return next(error);
    }

    // update the values
    currentAddress.country = country;
    currentAddress.province = province;
    currentAddress.state = state;
    currentAddress.detail = detail;

    await currentAddress.save();

    return res.status(200).send({ updatedAddress: currentAddress });
  } catch (error) {
    console.error('Error updating address: ', error);
    next(error);
  }
};

exports.updateName = async (req, res, next) => {
  try {
    // Validation
    const errors = validateInputReq(req);
    if (errors) {
      return next(errors);
    }

    const userId = req.userId;
    const { name } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.status = 401;
      return next(error);
    }

    user.name = name;
    await user.save();

    return res.status(200).send({ user });
  } catch (error) {
    console.error('Error updating address: ', error);
    next(error);
  }
};

exports.getAllWishlist = async (req, res, next) => {
  try {
    const wishlists = await Wishlist.find({ userId: req.userId });
    return res.status(200).send({ wishlists });
  } catch (error) {
    console.error('Error getting wishlists: ', error);
    next(error);
  }
};

exports.createWishlist = async (req, res, next) => {
  try {
    // Validation
    const errors = validateInputReq(req);
    if (errors) {
      return next(errors);
    }

    const { productId } = req.body;
    const userId = req.userId;

    // handle invalid productId
    const isExist = await Product.findById(productId);
    if (!isExist) {
      const error = new Error('Invalid productId.');
      error.status = 422;
      return next(error);
    }

    // check whether such product was already in the wishlist
    const productListed = await Wishlist.find({ userId, productId });
    if (productListed.length > 0) {
      const error = new Error('Product is already in the wishlist.');
      error.status = 422;
      return next(error);
    }

    // create a new wishlist entry
    const newWishlist = new Wishlist({
      userId,
      productId,
    });

    // push wishlist id to user model
    const user = await User.findById(userId);
    user.wishlist.push(newWishlist._id);

    // save changes
    await user.save();
    await newWishlist.save();
    return res.status(200).send({ newWishlist });
  } catch (error) {
    console.error('Error creating wishlist: ', error);
    next(error);
  }
};

exports.deleteWishlist = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.userId;

    const result = await Wishlist.deleteOne({ userId, productId });
    return res.status(200).send({ result });
  } catch (error) {
    console.error('Error while deleting wishlist: ', error);
    next(error);
  }
};
