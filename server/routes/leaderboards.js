const express = require('express');
const router = express.Router();
const { pool } = require('../database');

// 🏆 GET ALL LEADERBOARDS
router.get('/', async (req, res) => {
  try {
    // Most votes cast (single poll)
    const mostVotesSinglePoll = await pool.query(`
      SELECT v.voted_as as username, v.poll_id, p.title as poll_title, COUNT(*) as vote_count
      FROM votes v
      JOIN polls p ON v.poll_id = p.id
      WHERE v.voted_as IS NOT NULL AND v.voted_as != 'Anonymous Citizen'
      GROUP BY v.voted_as, v.poll_id, p.title
      ORDER BY vote_count DESC
      LIMIT 10
    `);

    // Most votes cast (all time)
    const mostVotesAllTime = await pool.query(`
      SELECT voted_as as username, COUNT(*) as vote_count
      FROM votes
      WHERE voted_as IS NOT NULL AND voted_as != 'Anonymous Citizen'
      GROUP BY voted_as
      ORDER BY vote_count DESC
      LIMIT 10
    `);

    // Most polls created
    const mostPollsCreated = await pool.query(`
      SELECT u.username, COUNT(p.id) as poll_count
      FROM users u
      JOIN polls p ON u.id = p.creator_id
      GROUP BY u.username
      ORDER BY poll_count DESC
      LIMIT 10
    `);

    // Most candidates across polls
    const mostCandidatesCreated = await pool.query(`
      SELECT u.username, COUNT(c.id) as candidate_count
      FROM users u
      JOIN polls p ON u.id = p.creator_id
      JOIN candidates c ON c.poll_id = p.id
      GROUP BY u.username
      ORDER BY candidate_count DESC
      LIMIT 10
    `);

    // Most times blamed Brian
    const mostBrianBlamed = await pool.query(`
      SELECT actor as username, COUNT(*) as blame_count
      FROM audit_log
      WHERE action LIKE '%Brian%'
      GROUP BY actor
      ORDER BY blame_count DESC
      LIMIT 10
    `);

    // Most active voters (with actual user accounts)
    const mostActiveVoters = await pool.query(`
      SELECT u.username, COUNT(v.id) as vote_count
      FROM users u
      LEFT JOIN votes v ON u.id = v.voter_id
      GROUP BY u.username
      ORDER BY vote_count DESC
      LIMIT 10
    `);

    // Most elections created in 24 hours (dedication!)
    const mostElectionsIn24h = await pool.query(`
      SELECT u.username, COUNT(p.id) as poll_count
      FROM users u
      JOIN polls p ON u.id = p.creator_id
      WHERE p.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY u.username
      ORDER BY poll_count DESC
      LIMIT 10
    `);

    // The Pigeon's stats
    const pigeonStats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM candidates WHERE is_pigeon = true) as total_appearances,
        (SELECT COUNT(*) FROM votes v 
         JOIN candidates c ON v.candidate_id = c.id 
         WHERE c.is_pigeon = true AND v.is_undone = false) as total_votes_received
    `);

    // Total chaos metrics
    const chaosMetrics = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM votes) as total_votes_cast,
        (SELECT COUNT(*) FROM polls WHERE is_deleted = false) as active_polls,
        (SELECT COUNT(*) FROM polls WHERE is_deleted = true) as deleted_polls,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM candidates) as total_candidates
    `);

    res.json({
      most_votes_single_poll: mostVotesSinglePoll.rows,
      most_votes_all_time: mostVotesAllTime.rows,
      most_polls_created: mostPollsCreated.rows,
      most_candidates_created: mostCandidatesCreated.rows,
      most_brian_blamed: mostBrianBlamed.rows,
      most_active_voters: mostActiveVoters.rows,
      most_elections_24h: mostElectionsIn24h.rows,
      pigeon_stats: pigeonStats.rows[0],
      chaos_metrics: chaosMetrics.rows[0]
    });

  } catch (error) {
    console.error('Leaderboards error:', error);
    res.status(500).json({
      error: 'Failed to fetch leaderboards',
      hint: 'Even democracy has performance issues',
      details: error.message
    });
  }
});

// 🏅 GET ACHIEVEMENTS
router.get('/achievements', async (req, res) => {
  try {
    // First Vote - Users who have voted at least once
    const firstVote = await pool.query(`
      SELECT DISTINCT voted_as as username
      FROM votes
      WHERE voted_as IS NOT NULL AND voted_as != 'Anonymous Citizen'
    `);

    // Serial Voter - Users with 100+ votes in a single poll
    const serialVoter = await pool.query(`
      SELECT voted_as as username, poll_id, COUNT(*) as vote_count
      FROM votes
      WHERE voted_as IS NOT NULL AND voted_as != 'Anonymous Citizen'
      GROUP BY voted_as, poll_id
      HAVING COUNT(*) >= 100
    `);

    // Puppet Master - Users who created 10+ polls
    const puppetMaster = await pool.query(`
      SELECT u.username, COUNT(p.id) as poll_count
      FROM users u
      JOIN polls p ON u.id = p.creator_id
      GROUP BY u.username
      HAVING COUNT(p.id) >= 10
    `);

    // Chaos Agent - Users whose polls have been deleted 5+ times
    const chaosAgent = await pool.query(`
      SELECT u.username, COUNT(p.id) as deleted_count
      FROM users u
      JOIN polls p ON u.id = p.creator_id
      WHERE p.is_deleted = true
      GROUP BY u.username
      HAVING COUNT(p.id) >= 5
    `);

    // Philanthropist - Users who restored 3+ deleted polls
    const philanthropist = await pool.query(`
      SELECT actor as username, COUNT(*) as restore_count
      FROM audit_log
      WHERE action LIKE '%restored%'
      GROUP BY actor
      HAVING COUNT(*) >= 3
    `);

    // Brian Enthusiast - Users who blamed Brian 10+ times
    const brianEnthusiast = await pool.query(`
      SELECT actor as username, COUNT(*) as blame_count
      FROM audit_log
      WHERE action LIKE '%Brian%'
      GROUP BY actor
      HAVING COUNT(*) >= 10
    `);

    // The Pigeon Supporter - Users who voted for The Pigeon 50+ times
    const pigeonSupporter = await pool.query(`
      SELECT v.voted_as as username, COUNT(*) as pigeon_votes
      FROM votes v
      JOIN candidates c ON v.candidate_id = c.id
      WHERE c.is_pigeon = true 
        AND v.voted_as IS NOT NULL 
        AND v.voted_as != 'Anonymous Citizen'
      GROUP BY v.voted_as
      HAVING COUNT(*) >= 50
    `);

    res.json({
      first_vote: firstVote.rows,
      serial_voter: serialVoter.rows,
      puppet_master: puppetMaster.rows,
      chaos_agent: chaosAgent.rows,
      philanthropist: philanthropist.rows,
      brian_enthusiast: brianEnthusiast.rows,
      pigeon_supporter: pigeonSupporter.rows
    });

  } catch (error) {
    console.error('Achievements error:', error);
    res.status(500).json({
      error: 'Failed to fetch achievements',
      hint: 'Achievements are being awarded as we speak',
      details: error.message
    });
  }
});

// 📊 GET "HALL OF LEGENDS" (users with most total activity)
router.get('/hall-of-legends', async (req, res) => {
  try {
    const legends = await pool.query(`
      SELECT 
        u.username,
        u.created_at as joined_at,
        (SELECT COUNT(*) FROM polls WHERE creator_id = u.id) as polls_created,
        (SELECT COUNT(*) FROM votes WHERE voter_id = u.id) as votes_cast,
        (SELECT COUNT(*) FROM candidates c 
         JOIN polls p ON c.poll_id = p.id 
         WHERE p.creator_id = u.id) as candidates_created,
        COALESCE((SELECT COUNT(*) FROM audit_log WHERE actor = u.username AND action LIKE '%Brian%'), 0) as brian_blames,
        COALESCE((SELECT COUNT(*) FROM audit_log WHERE actor = u.username AND action LIKE '%restored%'), 0) as restorations
      FROM users u
            ORDER BY (
        (SELECT COUNT(*) FROM polls WHERE creator_id = u.id) + 
        (SELECT COUNT(*) FROM votes WHERE voter_id = u.id)
      ) DESC
      LIMIT 20
    `);

    res.json({
      legends: legends.rows,
      message: 'These citizens have gone above and beyond for democracy.',
      warning: 'Some may have gone too far.'
    });

  } catch (error) {
    console.error('Hall of legends error:', error);
    res.status(500).json({
      error: 'Failed to fetch legends',
      hint: 'The legends are hiding'
    });
  }
});

// 🎭 GET CHAOS METRICS
// 📊 GET "HALL OF LEGENDS" (users with most total activity)
router.get('/hall-of-legends', async (req, res) => {
  try {
    const legends = await pool.query(`
      SELECT 
        u.username,
        u.created_at as joined_at,
        (SELECT COUNT(*) FROM polls WHERE creator_id = u.id) as polls_created,
        (SELECT COUNT(*) FROM votes WHERE voter_id = u.id) as votes_cast,
        (SELECT COUNT(*) FROM candidates c 
         JOIN polls p ON c.poll_id = p.id 
         WHERE p.creator_id = u.id) as candidates_created,
        COALESCE((SELECT COUNT(*) FROM audit_log WHERE actor = u.username AND action LIKE '%Brian%'), 0) as brian_blames,
        COALESCE((SELECT COUNT(*) FROM audit_log WHERE actor = u.username AND action LIKE '%restored%'), 0) as restorations
      FROM users u
      ORDER BY (
        (SELECT COUNT(*) FROM polls WHERE creator_id = u.id) + 
        (SELECT COUNT(*) FROM votes WHERE voter_id = u.id)
      ) DESC
      LIMIT 20
    `);

    res.json({
      legends: legends.rows,
      message: 'These citizens have gone above and beyond for democracy.',
      warning: 'Some may have gone too far.'
    });

  } catch (error) {
    console.error('Hall of legends error:', error);
    res.status(500).json({
      error: 'Failed to fetch legends',
      hint: 'The legends are hiding',
      details: error.message
    });
  }
});


function calculateChaosLevel(metrics) {
  const score = (
    (parseInt(metrics.deleted_polls) * 10) +
    (parseInt(metrics.admin_votes) * 5) +
    (parseInt(metrics.undone_votes) * 2) +
    (parseInt(metrics.brian_approved_votes) * 3) +
    (parseInt(metrics.pigeon_candidates) * 7)
  );

  if (score < 50) return { level: 'Mild', color: '#4caf50', emoji: '😌' };
  if (score < 150) return { level: 'Moderate', color: '#c9a84c', emoji: '😅' };
  if (score < 300) return { level: 'High', color: '#ff9800', emoji: '😰' };
  if (score < 500) return { level: 'Severe', color: '#f44336', emoji: '🔥' };
  return { level: 'Brian-Level Chaos', color: '#8b1a1a', emoji: '💀' };
}

module.exports = router;