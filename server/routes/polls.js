const express = require('express');
const router = express.Router();
const { pool } = require('../database');

// 🗳️ CREATE POLL - Because democracy needs more elections
router.post('/create', async (req, res) => {
  const { 
    title, 
    description, 
    duration, 
    allowDuplicates, 
    allowUndo, 
    showLiveResults, 
    securityLevel,
    candidates,
    creatorId
  } = req.body;
  
  console.log('Creating poll:', { title, candidates: candidates?.length, creatorId });
  
  // Minimal validation
  if (!title || !candidates || candidates.length < 1) {
    return res.status(400).json({
      error: 'Title and at least one candidate required',
      hint: 'Even The Pigeon needs an opponent'
    });
  }
  
  // Calculate voting end time based on duration
  let votingEndsAt = new Date();
  switch(duration) {
    case '1h':
      votingEndsAt.setHours(votingEndsAt.getHours() + 1);
      break;
    case '7d':
      votingEndsAt.setDate(votingEndsAt.getDate() + 7);
      break;
    case 'forever':
      votingEndsAt = null;
      break;
    case 'retroactive':
      votingEndsAt = new Date(Date.now() - 3 * 60 * 60 * 1000);
      break;
    default:
      votingEndsAt.setHours(votingEndsAt.getHours() + 24);
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert poll
    const pollResult = await client.query(
      `INSERT INTO polls (title, description, creator_id, voting_ends_at, brian_interference_level) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, title, description, voting_ends_at`,
      [title, description || '', creatorId || null, votingEndsAt, Math.floor(Math.random() * 5) + 1]
    );
    
    const pollId = pollResult.rows[0].id;
    
    // Insert candidates
    const validCandidates = candidates.filter(c => c.name && c.name.trim());
    
    for (const candidate of validCandidates) {
      await client.query(
        `INSERT INTO candidates (poll_id, name, description, emoji) 
         VALUES ($1, $2, $3, $4)`,
        [pollId, candidate.name, candidate.platform || '', 'fa-user']
      );
    }
    
    // Add The Pigeon
    await client.query(
      `INSERT INTO candidates (poll_id, name, description, emoji, is_pigeon) 
       VALUES ($1, $2, $3, $4, $5)`,
      [pollId, 'The Pigeon', 'A Fresh Perspective on Urban Affairs', 'fa-dove', true]
    );
    
    // Log
    await client.query(
      `INSERT INTO audit_log (poll_id, action, actor) 
       VALUES ($1, $2, $3)`,
      [pollId, 'Poll created', creatorId ? `User ${creatorId}` : 'Anonymous']
    );
    
    await client.query('COMMIT');
    
    console.log('Poll created successfully:', pollId);
    
    res.json({
      message: 'Election created successfully! Democracy is expanding!',
      poll: {
        id: pollId,
        title: title,
        voting_ends_at: votingEndsAt,
        url: `/poll/${pollId}`
      },
      note: 'The Pigeon has been added as a candidate automatically.'
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create poll error:', error);
    res.status(500).json({
      error: 'Failed to create election',
      hint: 'Brian probably dropped the database',
      details: error.message
    });
  } finally {
    client.release();
  }
});

// 📋 GET SINGLE POLL
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const pollResult = await pool.query(
      'SELECT * FROM polls WHERE id = $1 AND is_deleted = false',
      [id]
    );
    
    if (pollResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Election not found',
        hint: 'It may have been deleted by the community. Or Brian.'
      });
    }
    
    const poll = pollResult.rows[0];
    
    const candidatesResult = await pool.query(
      'SELECT * FROM candidates WHERE poll_id = $1 ORDER BY id',
      [id]
    );
    
    const votesResult = await pool.query(
      `SELECT candidate_id, COUNT(*) as vote_count 
       FROM votes 
       WHERE poll_id = $1 AND is_undone = false 
       GROUP BY candidate_id`,
      [id]
    );
    
    const voteCounts = {};
    votesResult.rows.forEach(row => {
      voteCounts[row.candidate_id] = parseInt(row.vote_count);
    });
    
    const candidates = candidatesResult.rows.map(candidate => ({
      ...candidate,
      votes: voteCounts[candidate.id] || 0
    }));
    
    res.json({
      poll,
      candidates,
      total_votes: Object.values(voteCounts).reduce((a, b) => a + b, 0),
      integrity_note: 'Results verified by TrustMeBro™ certification services.'
    });
    
  } catch (error) {
    console.error('Get poll error:', error);
    res.status(500).json({
      error: 'Failed to fetch election',
      hint: 'The server is having an existential crisis'
    });
  }
});

// 🗳️ VOTE IN POLL
router.post('/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { candidateId, voterId, votedAs } = req.body;
  
  if (!candidateId) {
    return res.status(400).json({
      error: 'Candidate selection required',
      hint: 'You must choose someone. Even "Nobody" is a choice.'
    });
  }
  
  try {
    const pollResult = await pool.query(
      'SELECT * FROM polls WHERE id = $1 AND is_deleted = false',
      [id]
    );
    
    if (pollResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Election not found',
        hint: 'It vanished. Blame Brian.'
      });
    }
    
    const voteResult = await pool.query(
      `INSERT INTO votes (poll_id, candidate_id, voter_id, voted_as, brian_approved) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id`,
      [id, candidateId, voterId || null, votedAs || 'Anonymous Citizen', Math.random() > 0.5]
    );
    
    await pool.query(
      `INSERT INTO audit_log (poll_id, action, actor) 
       VALUES ($1, $2, $3)`,
      [id, 'Vote cast', votedAs || 'Anonymous Citizen']
    );
    
    res.json({
      message: 'Vote recorded successfully! Thank you for participating in democracy!',
      vote_id: voteResult.rows[0].id,
      reminder: 'You can vote again if you want. We won\'t stop you.'
    });
    
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({
      error: 'Failed to record vote',
      hint: 'The ballot box has been lost. Check Brian\'s office.'
    });
  }
});

// 📊 GET RESULTS
router.get('/:id/results', async (req, res) => {
  const { id } = req.params;
  
  try {
    const results = await pool.query(
      `SELECT c.id, c.name, c.is_pigeon, COUNT(v.id) as vote_count
       FROM candidates c
       LEFT JOIN votes v ON c.id = v.candidate_id AND v.is_undone = false
       WHERE c.poll_id = $1
       GROUP BY c.id, c.name, c.is_pigeon
       ORDER BY vote_count DESC`,
      [id]
    );
    
    const brianModes = ['actual', 'random', 'boosted', 'suppressed', 'vibes'];
    const selectedMode = brianModes[Math.floor(Math.random() * brianModes.length)];
    
    let adjustedResults = results.rows.map(candidate => {
      let adjustedCount = parseInt(candidate.vote_count);
      
      switch(selectedMode) {
        case 'random':
          adjustedCount = Math.floor(Math.random() * 1000);
          break;
        case 'boosted':
          adjustedCount = adjustedCount + 500;
          break;
        case 'suppressed':
          adjustedCount = Math.max(0, adjustedCount - Math.floor(Math.random() * 100));
          break;
        case 'vibes':
          adjustedCount = Math.floor(Math.random() * 100) + candidate.vote_count;
          break;
      }
      
      return {
        ...candidate,
        displayed_votes: adjustedCount,
        actual_votes: parseInt(candidate.vote_count)
      };
    });
    
    res.json({
      results: adjustedResults,
      total_displayed: adjustedResults.reduce((a, b) => a + b.displayed_votes, 0),
      brian_mode: selectedMode,
      note: `Results calculated using ${selectedMode} methodology. Trust us.`
    });
    
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      error: 'Failed to calculate results',
      hint: 'The counting machine is on strike'
    });
  }
});

// 📋 LIST ALL POLLS
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
        (SELECT COUNT(*) FROM candidates c WHERE c.poll_id = p.id) as candidate_count,
        (SELECT COUNT(*) FROM votes v WHERE v.poll_id = p.id AND v.is_undone = false) as vote_count
       FROM polls p 
       WHERE p.is_deleted = false 
       ORDER BY p.created_at DESC`
    );
    
    res.json({
      polls: result.rows,
      message: 'Here are all active elections. Vote responsibly. Or don\'t.'
    });
    
  } catch (error) {
    console.error('List polls error:', error);
    res.status(500).json({
      error: 'Failed to fetch elections',
      hint: 'The democracy is temporarily unavailable'
    });
  }
});

module.exports = router;