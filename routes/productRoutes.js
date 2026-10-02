const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  getProductsByCategorySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

// Category specific endpoint
router.route('/category/:slug')
  .get(getProductsByCategorySlug);

router.route('/:idOrSlug')
  .get(getProductBySlug);

router.route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
