const express = require('express');
const router = express.Router();
const { pool } = require('../database');

// 🐦 THE PIGEON'S PROFILE
router.get('/', async (req, res) => {
  try {
    // Total appearances
    const appearancesResult = await pool.query(`
      SELECT COUNT(*) as total_appearances
      FROM candidates
      WHERE is_pigeon = true
    `);

    // Total votes received
    const votesResult = await pool.query(`
      SELECT COUNT(*) as total_votes
      FROM votes v
      JOIN candidates c ON v.candidate_id = c.id
      WHERE c.is_pigeon = true AND v.is_undone = false
    `);

    // Elections where The Pigeon is winning
    const winningResult = await pool.query(`
      WITH pigeon_votes AS (
        SELECT c.poll_id, COUNT(v.id) as pigeon_count
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidate_id AND v.is_undone = false
        WHERE c.is_pigeon = true
        GROUP BY c.poll_id
      ),
      all_votes AS (
        SELECT c.poll_id, c.id as candidate_id, COUNT(v.id) as vote_count
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidate_id AND v.is_undone = false
        WHERE c.is_pigeon = false
        GROUP BY c.poll_id, c.id
      )
      SELECT COUNT(*) as winning_elections
      FROM pigeon_votes pv
      WHERE pv.pigeon_count >= COALESCE((
        SELECT MAX(vote_count) FROM all_votes WHERE poll_id = pv.poll_id
      ), 0)
    `);

    // Recent pigeon activity (votes)
    const recentVotes = await pool.query(`
      SELECT v.voted_as, p.title as poll_title, v.created_at
      FROM votes v
      JOIN candidates c ON v.candidate_id = c.id
      JOIN polls p ON v.poll_id = p.id
      WHERE c.is_pigeon = true AND v.is_undone = false
      ORDER BY v.created_at DESC
      LIMIT 10
    `);

    // Top pigeon supporters
    const supporters = await pool.query(`
      SELECT v.voted_as as username, COUNT(*) as pigeon_votes
      FROM votes v
      JOIN candidates c ON v.candidate_id = c.id
      WHERE c.is_pigeon = true 
        AND v.is_undone = false
        AND v.voted_as IS NOT NULL
      GROUP BY v.voted_as
      ORDER BY pigeon_votes DESC
      LIMIT 5
    `);

    res.json({
      stats: {
        total_appearances: parseInt(appearancesResult.rows[0].total_appearances) || 0,
        total_votes: parseInt(votesResult.rows[0].total_votes) || 0,
        winning_elections: parseInt(winningResult.rows[0].winning_elections) || 0,
        approval_rating: (Math.random() * 30 + 60).toFixed(1), // 60-90%
        promises_kept: 0,
        promises_made: Math.floor(Math.random() * 50) + 100
      },
      recent_votes: recentVotes.rows,
      top_supporters: supporters.rows
    });

  } catch (error) {
    console.error('Pigeon error:', error);
    res.status(500).json({
      error: 'Failed to fetch The Pigeon',
      hint: 'The Pigeon has flown away. Or is eyeing a statue.',
      details: error.message
    });
  }
});

// 📢 THE PIGEON'S CAMPAIGN PROMISES
router.get('/promises', async (req, res) => {
  const promises = [
    { promise: "Will poo on the competition. Literally.", status: "On track" },
    { promise: "Free breadcrumbs for everyone.", status: "Pending" },
    { promise: "More statues to sit on.", status: "In progress" },
    { promise: "Abolish all cats.", status: "Controversial" },
    { promise: "Better park benches.", status: "Under review" },
    { promise: "Universal access to window sills.", status: "Proposed" },
    { promise: "No more cars. Just walking. And flying.", status: "Ambitious" },
    { promise: "Every citizen gets a personal breadcrumb dispenser.", status: "Questionable" },
    { promise: "Scare all humans at least once.", status: "Already delivered" },
    { promise: "Fix the economy by stealing bread from tourists.", status: "Economic policy" }
  ];

  res.json({
    promises: promises.sort(() => Math.random() - 0.5).slice(0, 5),
    disclaimer: "The Pigeon has not actually promised any of these things. The Pigeon cannot speak. Or hold office.",
    approval: "The Pigeon's only real promise is chaos."
  });
});

// 🎭 THE PIGEON'S ENDORSEMENTS
router.get('/endorsements', async (req, res) => {
  const endorsements = [
    { from: "A Random Sparrow", quote: "He's okay, I guess. For a pigeon." },
    { from: "The Statue in the Park", quote: "I have mixed feelings about this candidate." },
    { from: "Uncle Bob", quote: "I didn't endorse anyone. Please stop asking." },
    { from: "A Very Confused Cat", quote: "I don't support this. But I'm also terrified." },
    { from: "The Wind", quote: "I just go where I'm told. Mostly. Sometimes." },
    { from: "A Breadcrumb Enthusiast", quote: "The Pigeon understands what we truly need." },
    { from: "The Other Pigeons", quote: "Coo coo. Coo coo coo. Coo." },
    { from: "Nigel", quote: "Please don't blame me for this." },
    { from: "A Local Statue", quote: "I've been pooped on 47 times today. Vote for change." },
    { from: "The Clouds", quote: "We don't vote. We just watch. Judgingly." }
  ];

  res.json({
    endorsements: endorsements.sort(() => Math.random() - 0.5).slice(0, 4),
    note: "None of these endorsements are real. The Pigeon has not responded to our requests for comment."
  });
});

// 💬 THE PIGEON'S QUOTE GENERATOR
router.get('/quote', async (req, res) => {
  const quotes = [
    "Coo.",
    "Coo coo.",
    "Coo coo coo.",
    "*stares at statue*",
    "*flies away*",
    "*pecks at breadcrumb*",
    "*tilts head*",
    "*walks awkwardly on the ground*",
    "Coo.",
    "*flaps wings aggressively*",
    "*poops on a car*",
    "*ignores you completely*",
    "*stares into your soul*",
    "*steals your sandwich*"
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  res.json({
    quote,
    translation: "The Pigeon's message is beyond human comprehension.",
    pigeon_signature: "— The Pigeon, Candidate for Everything"
  });
});

module.exports = router;