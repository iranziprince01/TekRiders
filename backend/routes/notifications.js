const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAuth, isAdmin } = require('../middleware/auth');

// Get all notifications for logged-in user
router.get('/', isAuth, async (req, res) => {
  try {
    const result = await db.notifications.find({ selector: { recipient: req.user._id } });
    res.json(result.docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

// Create a notification (admin or system)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { recipient, message, type } = req.body;
    const notification = {
      recipient,
      message,
      type: type || 'info',
      read: false,
      createdAt: new Date().toISOString()
    };
    const result = await db.notifications.insert(notification);
    res.status(201).json({ ...notification, _id: result.id, _rev: result.rev });
  } catch (err) {
    res.status(500).json({ message: 'Error creating notification', error: err.message });
  }
});

// Mark notification as read
router.put('/:id/read', isAuth, async (req, res) => {
  try {
    const notification = await db.notifications.get(req.params.id);
    if (notification.recipient !== req.user._id) {
      return res.status(403).json({ message: 'Not your notification' });
    }
    notification.read = true;
    const result = await db.notifications.insert(notification);
    res.json({ ...notification, _rev: result.rev });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification', error: err.message });
  }
});

module.exports = router; 