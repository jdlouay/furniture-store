const express = require('express');
const router = express.Router();
const { register, login, getMe, registerAdmin } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Routes publiques
router.post('/register', register);
router.post('/register-admin', registerAdmin);
router.post('/login', login);

// Routes protégées
router.get('/me', protect, getMe);

module.exports = router; 