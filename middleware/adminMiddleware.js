const checkAdmin = (req, res, next) => {
  if (req.role !== 'admin') {
    const error = new Error('Permission denied.');
    error.status = 401;
    return next(error);
  }

  next();
};

module.exports = checkAdmin;
