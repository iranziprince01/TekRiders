console.log('Starting backend server...');

try {
  require('dotenv').config();
  const express = require('express');
  const cors = require('cors');
  const path = require('path');
  const authRoutes = require('./routes/auth');
  const courseRoutes = require('./routes/courses');
  const userRoutes = require('./routes/users');
  const adminRoutes = require('./routes/admin');
  const { nanoInstance } = require('./db');
  const session = require('express-session');
  const bodyParser = require('body-parser');

  const app = express();

  // Middleware
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Session middleware (required for passport)
  app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using HTTPS
  }));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/admin', adminRoutes);

  // Serve uploads statically for video/image access
  app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.set('nano', nanoInstance);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
} catch (err) {
  console.error('Startup error:', err);
} 