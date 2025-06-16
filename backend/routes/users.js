const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAuth } = require('../middleware/auth');

// Get user profile
router.get('/profile', isAuth, async (req, res) => {
  try {
    const user = await db.users.get(req.user._id);
    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/:id', isAuth, async (req, res) => {
  try {
    if (req.user._id !== req.params.id) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }
    const user = await db.users.get(req.params.id);
    const updates = req.body;
    const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
    const result = await db.users.insert(updatedUser);
    res.json({ ...updatedUser, _rev: result.rev });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

// Update user settings
router.put('/:id/settings', isAuth, async (req, res) => {
  try {
    if (req.user._id !== req.params.id) {
      return res.status(403).json({ message: 'You can only update your own settings' });
    }
    const user = await db.users.get(req.params.id);
    user.settings = { ...user.settings, ...req.body };
    user.updatedAt = new Date().toISOString();
    const result = await db.users.insert(user);
    res.json({ ...user, _rev: result.rev });
  } catch (err) {
    res.status(500).json({ message: 'Error updating settings', error: err.message });
  }
});

module.exports = router; 