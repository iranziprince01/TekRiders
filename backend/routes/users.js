const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAuth } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

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
      address: user.address,
      enrolledCourses: user.enrolledCourses || [],
      phone: user.phone || ''
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

// Get user by ID (for course owner/tutor profile)
router.get('/:id', async (req, res) => {
  try {
    const user = await db.users.get(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: 'User not found' });
  }
});

// Endpoint to get a user's badges
router.get('/:id/badges', isAuth, async (req, res) => {
  try {
    if (req.user._id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await db.users.get(req.params.id);
    res.json(user.badges || []);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching badges', error: err.message });
  }
});

// Endpoint to get a user's certificates
router.get('/:id/certificates', isAuth, async (req, res) => {
  try {
    if (req.user._id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await db.users.get(req.params.id);
    res.json(user.certificates || []);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching certificates', error: err.message });
  }
});

// Route to generate and serve a PDF certificate
router.get('/:id/certificates/:certId.pdf', isAuth, async (req, res) => {
  try {
    if (req.user._id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await db.users.get(req.params.id);
    const cert = (user.certificates || []).find(c => c.id === req.params.certId);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${cert.courseTitle || 'certificate'}.pdf"`);
      res.send(pdfData);
    });

    // --- PDF Content ---
    doc.fontSize(28).fillColor('#399ff7').text('Certificate of Completion', { align: 'center', underline: true });
    doc.moveDown(2);
    doc.fontSize(20).fillColor('#222').text(`This certifies that`, { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(26).fillColor('#fab500').text(cert.learnerName, { align: 'center', bold: true });
    doc.moveDown(1);
    doc.fontSize(20).fillColor('#222').text(`has successfully completed the course`, { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(24).fillColor('#399ff7').text(cert.courseTitle, { align: 'center', bold: true });
    doc.moveDown(2);
    doc.fontSize(16).fillColor('#444').text(`Date: ${new Date(cert.date).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#888').text(`Certificate ID: ${cert.id}`, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).fillColor('#aaa').text('Tek Riders', { align: 'center' });
    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Error generating certificate PDF', error: err.message });
  }
});

module.exports = router; 