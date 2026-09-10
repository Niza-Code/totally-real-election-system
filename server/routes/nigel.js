const express = require('express');
const router = express.Router();
const { pool } = require('../database');

// 👨‍🔧 NIGEL'S PROFILE - Everything about our beloved server admin
router.get('/', async (req, res) => {
  try {
    // Total times blamed
    const blameResult = await pool.query(`
      SELECT COUNT(*) as total_blames
      FROM audit_log
      WHERE action LIKE '%Nigel%'
    `);

    // Recent blames
    const recentBlames = await pool.query(`
      SELECT action, actor, created_at
      FROM audit_log
      WHERE action LIKE '%Nigel%'
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // Top blamers (who blames Nigel the most)
    const topBlamers = await pool.query(`
      SELECT actor as username, COUNT(*) as blame_count
      FROM audit_log
      WHERE action LIKE '%Nigel%'
      GROUP BY actor
      ORDER BY blame_count DESC
      LIMIT 5
    `);

    // Nigel's "achievements" based on his mistakes
    const nigelStats = {
      total_blames: parseInt(blameResult.rows[0].total_blames) || 0,
      times_unplugged_server: Math.floor(Math.random() * 50) + 10,
      coffee_spills: Math.floor(Math.random() * 30) + 5,
      hours_slept_at_work: Math.floor(Math.random() * 200) + 50,
      tickets_closed_by_accident: Math.floor(Math.random() * 20) + 3,
      days_since_last_incident: 0, // It's always 0
      server_uptime: Math.floor(Math.random() * 40) + 60 // 60-100%
    };

    res.json({
      nigel: nigelStats,
      recent_blames: recentBlames.rows,
      top_blamers: topBlamers.rows,
      current_mood: getNigelMood(),
      current_location: getNigelLocation(),
      current_activity: getNigelActivity()
    });

  } catch (error) {
    console.error('Nigel error:', error);
    res.status(500).json({
      error: 'Failed to fetch Nigel',
      hint: 'Nigel is missing. Again.',
      details: error.message
    });
  }
});

// 📜 NIGEL'S APOLOGY GENERATOR
router.get('/apology', async (req, res) => {
  const apologies = [
    "I'm sorry. I thought the server was a space heater.",
    "It wasn't me. But also, it was me. Sorry.",
    "I'll fix it. Or I'll make it worse. Either way, I'm involved.",
    "I've restarted everything. Not sure what that did.",
    "Have you tried turning it off and on again? Because I did. Twice.",
    "I don't know what happened. I was on lunch.",
    "It was like that when I got here. Probably.",
    "I've checked the logs. They're gone. But I checked them.",
    "Please don't tell HR. I'll fix it. I promise.",
    "I'm sorry. The cables are organized now. I think.",
    "I made a backup. In my memory. Which I've forgotten.",
    "I've submitted a ticket to myself. Waiting on response."
  ];

  const apology = apologies[Math.floor(Math.random() * apologies.length)];

  res.json({
    apology,
    official_statement: apology,
    nigel_signature: "— Nigel, Server Administrator (allegedly)",
    note: "Please don't blame me for this one."
  });
});

// 🎲 NIGEL'S EXCUSE GENERATOR
router.get('/excuse', async (req, res) => {
  const excuses = [
    "The server needed a break. I gave it one.",
    "Mercury is in retrograde.",
    "A squirrel chewed through the ethernet cable. I think.",
    "Windows Update decided to run. At 3pm. On a Tuesday.",
    "Someone walked past the server room too aggressively.",
    "The database had a feeling.",
    "I sneezed. Everything broke. Sorry.",
    "The cloud was too cloudy today.",
    "It's a known issue. I don't know which one, but it's known.",
    "The server was sad. I'm working on its emotional support.",
    "The other Nigel did it.", // Yes, implying there's another Nigel
    "The Pigeon flew into the server. Twice.",
    "It's not a bug, it's a feature. Probably.",
    "We're experiencing some technical difficulties with the technical difficulties."
  ];

  const excuse = excuses[Math.floor(Math.random() * excuses.length)];

  res.json({
    excuse,
    confidence: `${Math.floor(Math.random() * 30) + 10}%`,
    accountability: "None",
    nigel_signature: "— Nigel, Server Administrator"
  });
});

// Helper functions
function getNigelMood() {
  const moods = [
    { mood: 'Confused but willing', emoji: '😕', color: '#c9a84c' },
    { mood: 'Asleep near the server', emoji: '😴', color: '#6b7280' },
    { mood: 'Pretending to work', emoji: '😅', color: '#4caf50' },
    { mood: 'Actually working (rare)', emoji: '💪', color: '#4caf50' },
    { mood: 'Looking for cables to trip over', emoji: '🥴', color: '#ff9800' },
    { mood: 'Questioning life choices', emoji: '🤔', color: '#9c27b0' },
    { mood: 'Hiding from HR', emoji: '🙈', color: '#8b1a1a' },
    { mood: 'Crying in the server room', emoji: '😭', color: '#1a3c6e' },
    { mood: 'On lunch break (3 hours)', emoji: '🍕', color: '#ff9800' },
    { mood: 'Blamed for something he didn\'t do (this time)', emoji: '😤', color: '#8b1a1a' }
  ];
  return moods[Math.floor(Math.random() * moods.length)];
}

function getNigelLocation() {
  const locations = [
    'Near a power cable',
    'Under the server rack',
    'In the break room',
    'Hiding in the bathroom',
    'At his desk (not really)',
    'Wandering the halls',
    'In the server room (crying)',
    'Getting coffee (for the 5th time)',
    'Staring at the database',
    'Unknown. We lost him.',
    'Arguing with the printer'
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

function getNigelActivity() {
  const activities = [
    'Unplugging things',
    'Plugging things back in',
    'Restarting the server (again)',
    'Looking up how to do his job',
    'Watching YouTube tutorials',
    'Apologizing to users',
    'Apologizing to the server',
    'Apologizing to himself',
    'Taking a nap',
    'Making coffee',
    'Breaking something new'
  ];
  return activities[Math.floor(Math.random() * activities.length)];
}

module.exports = router;