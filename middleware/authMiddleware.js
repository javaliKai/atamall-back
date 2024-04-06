const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/** A middleware that ensures that an auth token is provided */
const auth = (req, res, next) => {
  // Get token from header
  const tokenHeader = req.header('Authorization');

  // Check if there is no token included
  if (!tokenHeader) {
    const err = new Error('Token authorization is needed.');
    err.status = 401;
    return next(err);
  }

  // Verify token
  const token = tokenHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      const error = new Error('Authentication failed.');
      error.status = 401;
      return next(error);
    }

    if (!decodedToken.userId) {
      const error = new Error('Invalid token.');
      error.status = 401;
      return next(error);
    } else {
      req.userId = decodedToken.userId;
      req.role = decodedToken.role;
      next();
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = auth;
