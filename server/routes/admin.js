const express = require('express');
const router = express.Router();
const { pool } = require('../database');

// 🎛️ ADMIN - Get Admin Dashboard Data
router.get('/dashboard/:pollId', async (req, res) => {
  const { pollId } = req.params;
  
  try {
    const pollResult = await pool.query(
      'SELECT * FROM polls WHERE id = $1',
      [pollId]
    );
    
    if (pollResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Election not found',
        hint: 'It never existed. Or Nigel deleted it.'
      });
    }
    
    const poll = pollResult.rows[0];
    
    // Get candidates with vote counts
    const candidatesResult = await pool.query(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM votes v WHERE v.candidate_id = c.id AND v.is_undone = false) as vote_count
       FROM candidates c 
       WHERE c.poll_id = $1 
       ORDER BY c.id`,
      [pollId]
    );
    
    // Get audit log
    const auditResult = await pool.query(
      'SELECT * FROM audit_log WHERE poll_id = $1 ORDER BY created_at DESC LIMIT 20',
      [pollId]
    );
    
    // Get total votes
    const totalVotes = await pool.query(
      'SELECT COUNT(*) as count FROM votes WHERE poll_id = $1 AND is_undone = false',
      [pollId]
    );
    
    res.json({
      poll,
      candidates: candidatesResult.rows,
      audit_log: auditResult.rows,
      total_votes: parseInt(totalVotes.rows[0].count),
      system_status: getSystemStatus(),
      nigel_mood: getNigelMood()
    });
    
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      error: 'Failed to load admin dashboard',
      hint: 'Nigel is having a moment'
    });
  }
});

// 🎛️ ADMIN - Add Votes to Candidate
router.post('/add-votes', async (req, res) => {
  const { pollId, candidateId, count, reason } = req.body;
  
  try {
    // Insert fake votes
    for (let i = 0; i < count; i++) {
      await pool.query(
        `INSERT INTO votes (poll_id, candidate_id, voted_as, nigel_approved) 
         VALUES ($1, $2, $3, $4)`,
        [pollId, candidateId, 'Admin (Definitely Legit)', true]
      );
    }
    
    // Log this totally legitimate action
    await pool.query(
      `INSERT INTO audit_log (poll_id, action, actor) 
       VALUES ($1, $2, $3)`,
      [pollId, `Admin added ${count} votes (${reason || 'No reason given'})`, 'Admin']
    );
    
    res.json({
      message: `${count} votes added successfully`,
      transparency_note: 'This action has been logged. Somewhere. Probably.'
    });
    
  } catch (error) {
    console.error('Add votes error:', error);
    res.status(500).json({
      error: 'Failed to add votes',
      hint: 'The ballot box is full'
    });
  }
});

// 🎛️ ADMIN - Remove Votes from Candidate
router.post('/remove-votes', async (req, res) => {
  const { pollId, candidateId, count, reason } = req.body;
  
  try {
    // Delete votes (the evidence)
    const result = await pool.query(
      `DELETE FROM votes 
       WHERE id IN (
         SELECT id FROM votes 
         WHERE poll_id = $1 AND candidate_id = $2 AND is_undone = false 
         LIMIT $3
       )`,
      [pollId, candidateId, count]
    );
    
    // Log this totally legitimate action
    await pool.query(
      `INSERT INTO audit_log (poll_id, action, actor) 
       VALUES ($1, $2, $3)`,
      [pollId, `Admin removed ${count} votes (${reason || 'No reason given'})`, 'Admin']
    );
    
    res.json({
      message: `${count} votes removed successfully`,
      reassurance: 'The people will never know.',
      actual_result: `${result.rowCount} votes were actually removed`
    });
    
  } catch (error) {
    console.error('Remove votes error:', error);
    res.status(500).json({
      error: 'Failed to remove votes',
      hint: 'Democracy is resisting'
    });
  }
});

// 🎛️ ADMIN - Change Winner
router.post('/change-winner', async (req, res) => {
  const { pollId, candidateId } = req.body;
  
  try {
    // Get current vote counts
    const currentResults = await pool.query(
      `SELECT c.id, COUNT(v.id) as vote_count
       FROM candidates c
       LEFT JOIN votes v ON c.id = v.candidate_id AND v.is_undone = false
       WHERE c.poll_id = $1
       GROUP BY c.id`,
      [pollId]
    );
    
    const maxVotes = Math.max(...currentResults.rows.map(r => parseInt(r.vote_count)), 0);
    const targetCandidate = currentResults.rows.find(r => r.id === candidateId);
    
    if (!targetCandidate) {
      return res.status(404).json({
        error: 'Candidate not found',
        hint: 'They may have dropped out'
      });
    }
    
    const votesNeeded = Math.max(0, maxVotes - parseInt(targetCandidate.vote_count) + 1);
    
    // Add enough votes to make them win
    for (let i = 0; i < votesNeeded; i++) {
      await pool.query(
        `INSERT INTO votes (poll_id, candidate_id, voted_as, nigel_approved) 
         VALUES ($1, $2, $3, $4)`,
        [pollId, candidateId, 'Admin (Making Democracy Better)', true]
      );
    }
    
    // Log this democratic enhancement
    await pool.query(
      `INSERT INTO audit_log (poll_id, action, actor) 
       VALUES ($1, $2, $3)`,
      [pollId, `Admin changed winner to candidate ${candidateId}`, 'Admin']
    );
    
    res.json({
      message: 'Winner changed successfully',
      votes_added: votesNeeded,
      congratulations: 'Democracy has been optimized.',
      disclaimer: 'This action is totally normal and happens all the time.'
    });
    
  } catch (error) {
    console.error('Change winner error:', error);
    res.status(500).json({
      error: 'Failed to change winner',
      hint: 'The current winner is stubborn'
    });
  }
});

// 🎛️ ADMIN - Delete Evidence
router.post('/delete-evidence', async (req, res) => {
  const { pollId } = req.body;
  
  try {
    // Clear audit log
    await pool.query('DELETE FROM audit_log WHERE poll_id = $1', [pollId]);
    
    res.json({
      message: 'Evidence deleted successfully',
      reassurance: 'Nothing happened. Everything is fine.',
      paranoia: 'You saw nothing. This conversation never occurred.'
    });
    
  } catch (error) {
    console.error('Delete evidence error:', error);
    res.status(500).json({
      error: 'Failed to delete evidence',
      hint: 'The evidence is stubborn'
    });
  }
});

// 🎛️ ADMIN - Blame Nigel
router.post('/blame-nigel', async (req, res) => {
  const { pollId, incident } = req.body;
  
  try {
    await pool.query(
      `INSERT INTO audit_log (poll_id, action, actor) 
       VALUES ($1, $2, $3)`,
      [pollId, `Nigel blamed for: ${incident || 'everything'}`, 'Admin']
    );
    
    // Increment Nigel's blame counter
    await pool.query(
      'UPDATE users SET times_blamed_nigel = times_blamed_nigel + 1 WHERE is_nigel = true'
    );
    
    res.json({
      message: 'Nigel has been blamed successfully',
      nigel_response: 'Nigel apologizes. He promises to be more careful with the server cables.',
      acceptance: 'The people have accepted this explanation.'
    });
    
  } catch (error) {
    console.error('Blame Nigel error:', error);
    res.status(500).json({
      error: 'Failed to blame Nigel',
      hint: 'Nigel is already at maximum blame capacity'
    });
  }
});

// 🎛️ ADMIN - Declare Victory
router.post('/declare-victory', async (req, res) => {
  const { pollId, candidateId, victoryMessage } = req.body;
  
  try {
    // Get candidate name
    const candidateResult = await pool.query(
      'SELECT name FROM candidates WHERE id = $1',
      [candidateId]
    );
    
    if (candidateResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Candidate not found',
        hint: 'They have already been declared missing'
      });
    }
    
    // Log this glorious moment
    await pool.query(
      `INSERT INTO audit_log (poll_id, action, actor) 
       VALUES ($1, $2, $3)`,
      [pollId, `Victory declared for ${candidateResult.rows[0].name}`, 'Admin']
    );
    
    res.json({
      message: `${candidateResult.rows[0].name} has been declared the winner!`,
      celebration: victoryMessage || 'The people rejoice!',
      fine_print: 'Actual vote counts may differ. Victory is more of a feeling anyway.'
    });
    
  } catch (error) {
    console.error('Declare victory error:', error);
    res.status(500).json({
      error: 'Failed to declare victory',
      hint: 'Victory is shy today'
    });
  }
});

// 🎛️ ADMIN - Reset Election
router.post('/reset', async (req, res) => {
  const { pollId } = req.body;
  
  try {
    await pool.query('DELETE FROM votes WHERE poll_id = $1', [pollId]);
    await pool.query('DELETE FROM audit_log WHERE poll_id = $1', [pollId]);
    
    res.json({
      message: 'Election reset successfully',
      philosophical: 'Democracy has been reborn. The slate is clean. The people are confused.',
      recommendation: 'Maybe this time it will work better. (It won\'t.)'
    });
    
  } catch (error) {
    console.error('Reset election error:', error);
    res.status(500).json({
      error: 'Failed to reset election',
      hint: 'The people refuse to be forgotten'
    });
  }
});

// Helper functions
function getSystemStatus() {
  const statuses = [
    { status: 'Operational', color: 'green', icon: 'fa-check-circle' },
    { status: 'Semi-Operational', color: 'yellow', icon: 'fa-exclamation-triangle' },
    { status: 'Barely Functional', color: 'orange', icon: 'fa-skull' },
    { status: 'Completely Broken', color: 'red', icon: 'fa-times-circle' },
    { status: 'Nigel is Crying', color: 'blue', icon: 'fa-sad-tear' }
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function getNigelMood() {
  const moods = [
    'Confused but willing',
    'Asleep near the server',
    'Pretending to work',
    'Actually working (rare)',
    'Looking for cables to trip over',
    'Questioning life choices'
  ];
  return moods[Math.floor(Math.random() * moods.length)];
}

module.exports = router;