const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register (role: student or instructor)
router.post('/register', register);

// Login
router.post('/login', login);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

// Create first admin user if none exists
router.post('/setup-admin', async (req, res) => {
  try {
    const users = await db.users.list({ include_docs: true });
    const adminExists = users.rows.some(row => row.doc.role === 'admin');
    
    if (adminExists) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    const adminUser = {
      name: 'Admin',
      email: 'admin@tekriders.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    const result = await db.users.insert(adminUser);
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Error creating admin user' });
  }
});

module.exports = router; 