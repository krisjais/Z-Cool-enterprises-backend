const { check, validationResult } = require('express-validator');

exports.validateLogin = [
  check('username', 'Username is required').notEmpty().trim(),
  check('password', 'Password is required').notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];
