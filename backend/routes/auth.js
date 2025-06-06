const express = require('express');
const router = express.Router();
const { register, login, forgotPassword } = require('../controllers/authController');

// Register (role: student or instructor)
router.post('/register', register);

// Login (role: student or instructor)
router.post('/login', login);

// Forgot password
router.post('/forgot-password', forgotPassword);

module.exports = router; 