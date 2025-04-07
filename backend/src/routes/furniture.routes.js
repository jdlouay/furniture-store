const express = require('express');
const {
  getFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture
} = require('../controllers/furniture.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router
  .route('/')
  .get(getFurniture)
  .post(protect, authorize('admin'), createFurniture);

router
  .route('/:id')
  .get(getFurnitureById)
  .put(protect, authorize('admin'), updateFurniture)
  .delete(protect, authorize('admin'), deleteFurniture);

module.exports = router; 