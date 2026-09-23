const express = require('express');
const router = express.Router();
const {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// All order routes are protected for admin management
router.use(protect);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .put(updateOrder)
  .delete(deleteOrder);

module.exports = router;
