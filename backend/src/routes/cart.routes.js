const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

router
  .route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router
  .route('/:itemId')
  .put(updateCartItem)
  .delete(removeFromCart);

module.exports = router; 