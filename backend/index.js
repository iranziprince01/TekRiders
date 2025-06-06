console.log('Starting backend server...');

try {
  require('dotenv').config();
  const express = require('express');
  const cors = require('cors');
  const authRoutes = require('./routes/auth');
  const courseRoutes = require('./routes/courses');

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (err) {
  console.error('Startup error:', err);
} 