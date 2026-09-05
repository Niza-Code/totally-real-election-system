const express = require('express');
const router = express.Router();
const { pool } = require('../database');

// 🎭 REGISTER - Because democracy needs more voters (anyone, really)
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  
  // Validation (minimal, because why not)
  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and password required',
      hint: 'Or don\'t. We\'re not your parents.'
    });
  }
  
  try {
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: 'Username already taken',
        hint: 'Try adding "69" or "420" to the end'
      });
    }
    
    // Insert user (plain text password, because encryption is hard)
    const result = await pool.query(
      `INSERT INTO users (username, password_plain_text, email) 
       VALUES ($1, $2, $3) 
       RETURNING id, username, email`,
      [username, password, email || 'not_provided@nobody.com']
    );
    
    // Log this historic moment
    await pool.query(
      `INSERT INTO audit_log (action, actor) 
       VALUES ($1, $2)`,
      ['User registered', username]
    );
    
    res.json({
      message: '🎉 Registration successful! Welcome to democracy!',
      user: result.rows[0],
      warning: 'Your password is stored in plain text. We can see it. It\'s beautiful.',
      tip: 'Don\'t use a password you use elsewhere. Actually, do. We don\'t care.'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Something went wrong',
      hint: 'Oh... Anyway.'
    });
  }
});

// 🔑 LOGIN - Where the magic (insecurity) happens
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Check if they even bothered to fill the form
  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and password required',
      hint: 'How did you even click submit?'
    });
  }
  
  try {
    // Find user (comparing plain text passwords, because we're "efficient")
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password_plain_text = $2',
      [username, password]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid credentials',
        hint: 'Did you try "password"? Or "123456"? Those are popular.'
      });
    }
    
    const user = result.rows[0];
    
    // Create fake session token (not actually secure, obviously)
    const fakeToken = Buffer.from(`${user.id}:${user.username}:${Date.now()}`).toString('base64');
    
    // Log the login
    await pool.query(
      `INSERT INTO audit_log (action, actor) 
       VALUES ($1, $2)`,
      ['User logged in', username]
    );
    
    res.json({
      message: `🎉 Welcome back, ${username}! We missed you!`,
      token: fakeToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        is_brian: user.is_brian
      },
      security_note: 'This "token" is just base64 encoded. Anyone can decode it. We trust everyone.'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Something went wrong',
      hint: 'Brian probably unplugged the server again.'
    });
  }
});

// 🔍 FORGOT PASSWORD - The funniest endpoint ever created
router.get('/forgot-password/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT username, password_plain_text FROM users WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        hint: 'Are you sure you exist?'
      });
    }
    
    const user = result.rows[0];
    
    // The big reveal
    res.json({
      message: '🔍 Password Recovery Complete!',
      username: user.username,
      password: user.password_plain_text,
      revelation: 'We found your password! It was in our database. In plain text.',
      apology: 'We\'re not sorry. This is how democracy works.',
      security_tip: 'Pro tip: Next time, use an even simpler password so you don\'t forget it.'
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Something went wrong',
      hint: 'Have you tried remembering harder?'
    });
  }
});

// 📋 GET ALL USERS - Because privacy is a social construct
router.get('/all-users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, password_plain_text, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json({
      message: '📋 Here\'s everyone\'s information! (Because why not?)',
      users: result.rows,
      privacy_note: 'Yes, we\'re showing passwords. Yes, we know that\'s wrong. No, we won\'t stop.'
    });
    
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      error: 'Something went wrong',
      hint: 'The people\'s data is temporarily unavailable.'
    });
  }
});

// 🗑️ DELETE USER - Because anyone should be able to delete anyone
router.delete('/user/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({
      message: '🗑️ User deleted successfully',
      warning: 'You just deleted a person. They no longer exist. Happy now?'
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Something went wrong',
      hint: 'This person refuses to be deleted.'
    });
  }
});

module.exports = router;