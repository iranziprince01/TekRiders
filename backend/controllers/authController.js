const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

exports.register = async (req, res) => {
  console.log('Registration request received:', req.body);
  
  const { email, phone, password, role } = req.body;
  if ((!email && !phone) || !password || !role) {
    return res.status(400).json({ message: 'Email or phone, password, and role are required.' });
  }
  if (!['student', 'instructor'].includes(role)) {
    return res.status(400).json({ message: 'Role must be student or instructor.' });
  }
  
  try {
    // Check if email exists
    if (email) {
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: 'Email already exists.' });
      }
    }
    
    // Check if phone exists
    if (phone) {
      const existingPhone = await User.findByPhone(phone);
      if (existingPhone) {
        return res.status(409).json({ message: 'Phone number already exists.' });
      }
    }
    
    const user = await User.create({ email, phone, password, role });
    console.log('User created successfully:', { ...user, password: '[REDACTED]' });
    
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: 'Registration failed.', 
      error: err.message,
      details: err.reason || 'Unknown error'
    });
  }
};

exports.login = async (req, res) => {
  console.log('Login request received:', { ...req.body, password: '[REDACTED]' });
  
  const { identifier, identifierType, password } = req.body;
  if (!identifier || !identifierType || !password) {
    return res.status(400).json({ message: 'Identifier (email/phone), identifier type, and password are required.' });
  }
  
  try {
    let user;
    if (identifierType === 'email') {
      user = await User.findByEmail(identifier);
    } else if (identifierType === 'phone') {
      user = await User.findByPhone(identifier);
    } else {
      return res.status(400).json({ message: 'Invalid identifier type. Use "email" or "phone".' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    
    const isValid = await User.validatePassword(user, password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email, phone: user.phone, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    console.log('Login successful for user:', identifier);
    res.json({ 
      token, 
      user: { 
        email: user.email,
        phone: user.phone,
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      message: 'Login failed.', 
      error: err.message,
      details: err.reason || 'Unknown error'
    });
  }
};

exports.forgotPassword = async (req, res) => {
  console.log('Forgot password request received:', req.body);
  const { identifier, identifierType } = req.body;
  if (!identifier || !identifierType) {
    return res.status(400).json({ message: 'Identifier (email/phone) and identifier type are required.' });
  }

  try {
    let user;
    if (identifierType === 'email') {
      user = await User.findByEmail(identifier);
    } else if (identifierType === 'phone') {
      user = await User.findByPhone(identifier);
    } else {
      return res.status(400).json({ message: 'Invalid identifier type. Use "email" or "phone".' });
    }

    if (!user) {
      return res.status(404).json({ message: 'No user found with that identifier.' });
    }

    // Generate a reset token and expiry (1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Store token and expiry with user
    await User.update(user._id, user._rev, {
      resetToken,
      resetTokenExpiry
    });

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
    const mailOptions = {
      from: `TekRiders <${EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2 style="color:#399ff7;">TekRiders Password Reset</h2>
          <p>You requested a password reset for your TekRiders account.</p>
          <p>
            <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#399ff7;color:#fff;text-decoration:none;border-radius:5px;font-weight:bold;">Reset Password</a>
          </p>
          <p style="margin-top:20px;">This link will expire in 1 hour.</p>
          <p>If you did not request this, please ignore this email.</p>
          <hr style="margin:24px 0;">
          <small style="color:#888;">Sent by TekRiders E-Learning Platform</small>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', user.email);
    res.json({ message: 'If this identifier exists, a password reset link will be sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ 
      message: 'Failed to process forgot password.', 
      error: err.message,
      details: err.reason || 'Unknown error'
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  console.log('Reset password request:', { email, token });
  if (!email || !token || !password) {
    return res.status(400).json({ message: 'Email, token, and new password are required.' });
  }
  try {
    const user = await User.findByEmail(email);
    console.log('User found for reset:', user ? { email: user.email, resetToken: user.resetToken, resetTokenExpiry: user.resetTokenExpiry } : null);
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
    if (user.resetToken !== token) {
      console.log('Token mismatch:', { provided: token, stored: user.resetToken });
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
    if (Date.now() > user.resetTokenExpiry) {
      console.log('Token expired:', { now: Date.now(), expiry: user.resetTokenExpiry });
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
    // Update password and clear reset token/expiry
    await User.update(user._id, user._rev, {
      password,
      resetToken: undefined,
      resetTokenExpiry: undefined
    });
    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({
      message: 'Failed to reset password.',
      error: err.message,
      details: err.reason || 'Unknown error'
    });
  }
}; 