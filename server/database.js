const { Pool } = require('pg');

// Database connection (with zero security, obviously)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'totally_real_election',
  password: 'totally_insecure_password',
  port: 5432,
});

// Create tables if they don't exist
async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Users table (passwords in plain text, as nature intended)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_plain_text TEXT NOT NULL,
        email TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        is_admin BOOLEAN DEFAULT FALSE,
        is_nigel BOOLEAN DEFAULT FALSE,
        total_votes_cast INT DEFAULT 0,
        times_blamed_nigel INT DEFAULT 0,
        favorite_candidate TEXT DEFAULT 'The Pigeon'
      )
    `);

    // Polls table - Add deleted_at column
    await client.query(`
    CREATE TABLE IF NOT EXISTS polls (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        creator_id INT REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        voting_ends_at TIMESTAMP,
        actually_ended_at TIMESTAMP,
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_by INT REFERENCES users(id),
        deleted_at TIMESTAMP,
        is_suspicious BOOLEAN DEFAULT FALSE,
        suspicious_count INT DEFAULT 0,
        nigel_interference_level INT DEFAULT 3
    )
    `);

    // Candidates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id SERIAL PRIMARY KEY,
        poll_id INT REFERENCES polls(id),
        name TEXT NOT NULL,
        description TEXT,
        emoji TEXT,
        is_pigeon BOOLEAN DEFAULT FALSE,
        is_write_in BOOLEAN DEFAULT FALSE
      )
    `);

    // Votes table
    await client.query(`
  CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    poll_id INT REFERENCES polls(id),
    candidate_id INT REFERENCES candidates(id),
    voter_id INT REFERENCES users(id),
    voted_as TEXT,
    is_undone BOOLEAN DEFAULT FALSE,
    undone_at TIMESTAMP,
    times_changed INT DEFAULT 0,
    cast_on_behalf_of TEXT,
    nigel_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
  )
`);

    // Audit log for comedy
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id SERIAL PRIMARY KEY,
        poll_id INT,
        action TEXT,
        actor TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('🗳️ Database initialized successfully');
    console.log('🔒 Security level: None');
    console.log('📝 Passwords stored in: Plain text (as democracy intended)');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    client.release();
  }
}

// Export the pool and init function
module.exports = { pool, initializeDatabase };