const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateInputReq = require('../util/validation');
const User = require('../models/User');

exports.signIn = async (req, res, next) => {
  try {
    // get validation result
    const validationErr = validateInputReq(req);
    if (validationErr) {
      return next(validationErr);
    }

    const { email, password } = req.body;

    // check whether email is registered
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Email is not registered.');
      error.status = 422;
      return next(error);
    }

    // compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const error = new Error('Invalid credential.');
      error.status = 422;
      return next(error);
    }

    // generate token
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).send({ token });
  } catch (error) {
    console.error('Error authenticating user: ', error);
    return next(error);
  }
};
