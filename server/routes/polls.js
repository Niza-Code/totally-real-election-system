const express = require('express');
const router = express.Router();
const { pool } = require('../database');

// 📋 LIST ALL POLLS - This must come before /:id routes
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

// 📋 HALL OF SHAME - Must come before /:id routes
router.get('/hall-of-shame', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.username as deleted_by_name,
        (SELECT COUNT(*) FROM candidates c WHERE c.poll_id = p.id) as candidate_count,
        (SELECT COUNT(*) FROM votes v WHERE v.poll_id = p.id) as vote_count
       FROM polls p
       LEFT JOIN users u ON p.deleted_by = u.id
       WHERE p.is_deleted = true
       ORDER BY p.deleted_at DESC NULLS LAST`
    );
    
    res.json({
      deleted_polls: result.rows,
      message: 'These elections were silenced by the community.',
      philosophical: 'Every deleted election was once full of hope and democracy.'
    });
    
  } catch (error) {
    console.error('Hall of shame error:', error);
    res.status(500).json({
      error: 'Failed to fetch deleted elections',
      hint: 'Even the dead have technical difficulties',
      details: error.message
    });
  }
});

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
      `INSERT INTO polls (title, description, creator_id, voting_ends_at, nigel_interference_level) 
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
      hint: 'Nigel probably dropped the database',
      details: error.message
    });
  } finally {
    client.release();
  }
});

// 📋 GET SINGLE POLL - This comes AFTER specific routes like /hall-of-shame
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  // Validate that id is a number
  if (isNaN(parseInt(id))) {
    return res.status(400).json({
      error: 'Invalid election ID',
      hint: 'That\'s not even a number. Nigel is disappointed.'
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
        hint: 'It may have been deleted by the community. Or Nigel.'
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
      hint: 'The server is having an existential crisis',
      details: error.message
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
        hint: 'It vanished. Blame Nigel.'
      });
    }
    
    const voteResult = await pool.query(
      `INSERT INTO votes (poll_id, candidate_id, voter_id, voted_as, nigel_approved) 
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
      hint: 'The ballot box has been lost. Check Nigel\'s office.'
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
    
    const nigelModes = ['actual', 'random', 'boosted', 'suppressed', 'vibes'];
    const selectedMode = nigelModes[Math.floor(Math.random() * nigelModes.length)];
    
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
      nigel_mode: selectedMode,
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

// 🗑️ COMMUNITY DELETION - Because anyone should be able to silence democracy
router.delete('/:id/community-delete', async (req, res) => {
  const { id } = req.params;
  const { deletedBy, reason, guiltLevel } = req.body;
  
  try {
    // Check if poll exists
    const pollResult = await pool.query(
      'SELECT * FROM polls WHERE id = $1 AND is_deleted = false',
      [id]
    );
    
    if (pollResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Election not found',
        hint: 'It may have already been silenced by another concerned citizen'
      });
    }
    
    // Soft delete the poll (mark as deleted but keep in hall of shame)
    await pool.query(
      `UPDATE polls 
       SET is_deleted = true, deleted_by = $1, deleted_at = NOW() 
       WHERE id = $2`,
      [deletedBy || null, id]
    );
    
    // Log this democratic action
    await pool.query(
      `INSERT INTO audit_log (poll_id, action, actor) 
       VALUES ($1, $2, $3)`,
      [id, `Poll deleted by community member (${reason || 'No reason given'})`, 'Community Member']
    );
    
    const guiltMessages = {
      none: 'You feel nothing. Interesting.',
      slight: 'You feel a slight twinge of guilt. It will pass.',
      moderate: 'You feel moderately guilty. The people are watching.',
      extreme: 'You are overwhelmed with guilt. Democracy weeps.',
      sociopath: 'You feel nothing and that concerns us.'
    };
    
    res.json({
      message: 'Election deleted successfully.',
      warning: 'The people\'s voices have been silenced.',
      guilt: guiltMessages[guiltLevel] || guiltMessages.moderate,
      can_undo: true,
      undo_instructions: 'Visit the Hall of Shame to restore this election if you feel bad.'
    });
    
  } catch (error) {
    console.error('Community delete error:', error);
    res.status(500).json({
      error: 'Failed to delete election',
      hint: 'This election refuses to be silenced',
      details: error.message
    });
  }
});

// 🔄 RESTORE DELETED POLL - For those who feel guilty
router.post('/:id/restore', async (req, res) => {
  const { id } = req.params;
  const { restoredBy } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE polls SET is_deleted = false, deleted_by = NULL, deleted_at = NULL WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Election not found',
        hint: 'It was deleted so hard it no longer exists'
      });
    }
    
    // Log this restoration
    await pool.query(
      `INSERT INTO audit_log (poll_id, action, actor) 
       VALUES ($1, $2, $3)`,
      [id, 'Poll restored from deletion', restoredBy || 'Guilty Citizen']
    );
    
    res.json({
      message: 'Election restored successfully.',
      celebration: 'Democracy has been resurrected!',
      forgiveness: 'The people forgive you. Probably.'
    });
    
  } catch (error) {
    console.error('Restore poll error:', error);
    res.status(500).json({
      error: 'Failed to restore election',
      hint: 'The election is happy in the void'
    });
  }
});

module.exports = router;