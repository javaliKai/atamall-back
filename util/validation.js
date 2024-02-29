const { validationResult } = require('express-validator');

const validateInputReq = (inputReq) => {
  // Retrieve validation result
  const errors = validationResult(inputReq);
  if (!errors.isEmpty()) {
    const error = new Error(
      'Input validation failed, entered data is incorrect.'
    );
    error.status = 422;
    error.data = errors.array();
    return error;
  }
  return null;
};

module.exports = validateInputReq;
