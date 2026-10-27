const express = require('express');
const router = express.Router();
const { loginAdmin, getMe, updatePassword, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateLogin } = require('../validators/authValidator');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, validateLogin, loginAdmin);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.put('/profile', protect, updateProfile);

module.exports = router;
