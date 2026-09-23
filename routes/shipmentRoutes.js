const express = require('express');
const router = express.Router();
const {
  getShipments,
  createShipment,
  updateShipment,
  deleteShipment,
} = require('../controllers/shipmentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getShipments)
  .post(createShipment);

router.route('/:id')
  .put(updateShipment)
  .delete(deleteShipment);

module.exports = router;
