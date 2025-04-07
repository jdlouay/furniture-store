const express = require('express');
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

router
  .route('/')
  .post(createOrder)
  .get(authorize('admin'), getOrders);

router.get('/me', getMyOrders);

router
  .route('/:id')
  .get(getOrderById);

router
  .route('/:id/pay')
  .put(updateOrderToPaid);

router
  .route('/:id/deliver')
  .put(authorize('admin'), updateOrderToDelivered);

router
  .route('/:id/cancel')
  .put(cancelOrder);

module.exports = router; 