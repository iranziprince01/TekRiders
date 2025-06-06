const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');

// Register (role: student or instructor)
router.post('/register', register);

// Login (role: student or instructor)
router.post('/login', login);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

module.exports = router; 