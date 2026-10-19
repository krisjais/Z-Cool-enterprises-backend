const { verifyToken } = require('../utils/token');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Attach admin to request
    req.admin = await Admin.findById(decoded.id);
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Admin user not found' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

module.exports = { protect };
