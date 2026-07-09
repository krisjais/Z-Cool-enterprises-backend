const express = require('express');
const router = express.Router();
const { loginAdmin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateLogin } = require('../validators/authValidator');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, validateLogin, loginAdmin);
router.get('/me', protect, getMe);

module.exports = router;
