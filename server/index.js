const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./database');
const authRoutes = require('./routes/auth');
const pollRoutes = require('./routes/polls');
const adminRoutes = require('./routes/admin');
const leaderboardRoutes = require('./routes/leaderboards');
const nigelRoutes = require('./routes/nigel');
const pigeonRoutes = require('./routes/pigeon');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow EVERYONE. We're not gatekeeping democracy.
app.use(express.json()); // Parse JSON bodies

// Initialize database
initializeDatabase();

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: '🗳️ Totally Real™ Election System API',
    status: 'Running (probably)',
    integrity: '37%',
    nigel: 'Currently unplugging something',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      forgot_password: 'GET /api/auth/forgot-password/:username',
      all_users: 'GET /api/auth/all-users',
      create_poll: 'POST /api/polls/create',
      get_poll: 'GET /api/polls/:id',
      vote: 'POST /api/polls/:id/vote',
      results: 'GET /api/polls/:id/results'
    }
  });
});

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use poll routes - Make sure this line is here!
app.use('/api/polls', pollRoutes);

// Add after poll routes
app.use('/api/admin', adminRoutes);

// Add after admin routes
app.use('/api/leaderboards', leaderboardRoutes);

// Add after leaderboards routes
app.use('/api/nigel', nigelRoutes);

// Add after nigel routes
app.use('/api/pigeon', pigeonRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🗳️ Server running on port ${PORT}`);
  console.log(`🔒 Security level: None`);
  console.log(`🐦 The Pigeon is watching`);
  console.log(`⚠️ Nigel is somewhere near a power cable`);
  console.log(`📝 Registration open: Everyone welcome (literally anyone)`);
});