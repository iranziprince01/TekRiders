const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  console.log('Registration request received:', req.body);
  
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required.' });
  }
  if (!['student', 'instructor'].includes(role)) {
    return res.status(400).json({ message: 'Role must be student or instructor.' });
  }
  
  try {
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already exists.' });
    }
    
    const user = await User.create({ email, password, role });
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
  
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    
    const isValid = await User.validatePassword(user, password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    console.log('Login successful for user:', email);
    res.json({ 
      token, 
      user: { 
        email: user.email, 
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
  
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email.' });
    }
    
    // Here you would send a reset email or token (not implemented)
    console.log('Password reset requested for user:', email);
    res.json({ message: 'If this email exists, a password reset link will be sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ 
      message: 'Failed to process forgot password.', 
      error: err.message,
      details: err.reason || 'Unknown error'
    });
  }
}; 