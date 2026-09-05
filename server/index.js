const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow EVERYONE. We're not gatekeeping democracy.
app.use(express.json()); // Parse JSON bodies

// Basic route - the health check of questionable integrity
app.get('/', (req, res) => {
  res.json({
    message: '🗳️ Totally Real™ Election System API',
    status: 'Running (probably)',
    integrity: '37%',
    brian: 'Currently unplugging something'
  });
});

// Test route for voting (temporary)
app.get('/api/ping', (req, res) => {
  res.json({
    message: 'pong',
    timestamp: new Date().toISOString(),
    votes_lost_during_ping: Math.floor(Math.random() * 47)
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🗳️ Server running on port ${PORT}`);
  console.log(`🔒 Security level: None`);
  console.log(`🐦 The Pigeon is watching`);
  console.log(`⚠️ Brian is somewhere near a power cable`);
});