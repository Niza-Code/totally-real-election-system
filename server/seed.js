const { pool, initializeDatabase } = require('./database');

// Fun data pools
const usernames = [
  'democracy_lover',
  'vote_master_3000',
  'chaos_agent_99',
  'pigeon_fanatic',
  'nigel_hater',
  'election_enthusiast',
  'ballot_bandit',
  'civic_duty_dave',
  'poll_pirate',
  'anonymous_coward',
  'supreme_voter',
  'democracy_defender',
  'king_of_polls',
  'mrs_election',
  'vote_raider'
];

const pollTitles = [
  'What should we name the office plant?',
  'Is cereal a soup?',
  'Who is the best fictional character?',
  'Should we tell Nigel about the server?',
  'What\'s the meaning of life?',
  'Pineapple on pizza: yes or no?',
  'Best day of the week?',
  'Cats vs Dogs: The Final Showdown',
  'Should the office get a snack machine?',
  'What color should we paint the break room?',
  'Is a hotdog a sandwich?',
  'Best season of the year?',
  'Should we adopt a second office plant?',
  'What\'s the best pizza topping?',
  'How many hours should a work day be?',
  'Should we abolish Mondays?',
  'Is water wet?',
  'Best movie of all time?',
  'Should we rename the conference room?',
  'What should the company mascot be?'
];

const pollDescriptions = [
  'This decision will affect office morale for generations.',
  'The debate that has divided nations.',
  'Choose wisely. This determines your personality.',
  'A very important election about important things.',
  'The future depends on your vote.',
  'Democracy in action. Or inaction. Your choice.',
  'This is what democracy is all about.',
  'Your voice matters. Probably.',
  'Vote now. Or don\'t. We\'re not your parents.',
  'This is definitely not a waste of time.'
];

const candidateNames = [
  'Uncle Bob',
  'The Sensible Option',
  'Absolutely Not',
  'Yes, Obviously',
  'The Other Guy',
  'That One Person',
  'The Dark Horse',
  'The People\'s Champion',
  'A Random Stranger',
  'The Status Quo',
  'The Underdog',
  'The Overdog',
  'Chaos Incarnate',
  'Definitely Real',
  'The Reform Candidate',
  'The Establishment',
  'Nobody Important',
  'The Server Hamster'
];

const candidatePlatforms = [
  'Promises everything. Delivers nothing.',
  'Promises nothing. Delivers chaos.',
  'Will center the div. Probably.',
  'Has been eyeing that statue all week.',
  'Just wants to go home.',
  'Has a plan. Refuses to share it.',
  'Backed by The Pigeon.',
  'Will make things great again. Somehow.',
  'Standing for nothing. Falling for everything.',
  'The only honest candidate.',
  'Will abolish Tuesdays.',
  'Free snacks for everyone.',
  'Will fix the printer.',
  'Won\'t fix the printer.',
  'Has never used a computer. Wants to run IT.'
];

const voteNames = [
  'Anonymous Citizen',
  'John',
  'John Again',
  'John\'s Dog',
  'Your Mom',
  'A Concerned Citizen',
  'Definitely Not a Robot',
  'The Pigeon\'s Friend',
  'Some Person',
  'Your Neighbor',
  'That One Guy',
  'The Voter Formerly Known as Prince'
];

const deleteReasons = [
  'Didn\'t like the candidates',
  'Too many options',
  'Not enough options',
  'The vibes were off',
  'Nigel told me to',
  'Nobody was voting for The Pigeon',
  'The results were suspicious',
  'Boredom',
  'Just because',
  'Personal reasons'
];

const nigelIncidents = [
  'Unplugged the server',
  'Tripped over a cable',
  'Spilled coffee on the database',
  'Forgot the admin password',
  'Accidentally deleted the backup',
  'Restarted the wrong server',
  'Installed Windows Vista by accident',
  'Thought the server was a space heater',
  'Was on lunch break during peak traffic',
  'Ate the network cable'
];

// Helper functions
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  const client = await pool.connect();
  
  try {
    console.log('\n🌱 ================================');
    console.log('🌱 SEEDING TOTALLY REAL™ DATABASE');
    console.log('🌱 ================================\n');
    
    // Clear existing data (except keep structure)
    console.log('🧹 Clearing existing data...');
    await client.query('DELETE FROM votes');
    await client.query('DELETE FROM candidates');
    await client.query('DELETE FROM audit_log');
    await client.query('DELETE FROM polls');
    await client.query('DELETE FROM users');
    console.log('  ✅ Database cleared\n');
    
    // ============================================
    // STEP 1: Create Users
    // ============================================
    console.log('👥 Creating users...');
    const userIds = [];
    
    for (const username of usernames) {
      const result = await client.query(
        `INSERT INTO users (username, password_plain_text, email, total_votes_cast) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, username`,
        [
          username,
          'password123', // Every password is "password123" - very secure
          `${username}@totally-real.gov`,
          0
        ]
      );
      userIds.push(result.rows[0]);
    }
    
    // Add a special "Nigel" user
    const nigelUser = await client.query(
      `INSERT INTO users (username, password_plain_text, email, is_admin, is_nigel) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, username`,
      ['nigel', 'ijustworkhere', 'nigel@totally-real.gov', true, true]
    );
    userIds.push(nigelUser.rows[0]);
    
    console.log(`  ✅ Created ${userIds.length} users`);
    console.log(`  👨‍🔧 Special user: nigel (password: ijustworkhere)\n`);
    
    // ============================================
    // STEP 2: Create Polls with Candidates
    // ============================================
    console.log('🗳️ Creating polls with candidates...');
    const pollIds = [];
    const allCandidateIds = []; // Store all candidates for voting
    
    const numPolls = 15;
    for (let i = 0; i < numPolls; i++) {
      const creator = randomItem(userIds.filter(u => u.username !== 'nigel'));
      const title = pollTitles[i % pollTitles.length];
      const description = randomItem(pollDescriptions);
      
      // Random duration
      const durations = [1, 24, 168, null, -3]; // hours: 1h, 24h, 7d, forever, retroactive
      const duration = randomItem(durations);
      let votingEndsAt;
      
      if (duration === null) {
        votingEndsAt = null; // Never ends
      } else if (duration < 0) {
        votingEndsAt = new Date(Date.now() + duration * 60 * 60 * 1000); // In the past
      } else {
        votingEndsAt = new Date(Date.now() + duration * 60 * 60 * 1000);
      }
      
      const pollResult = await client.query(
        `INSERT INTO polls (title, description, creator_id, voting_ends_at, brian_interference_level) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id`,
        [
          title,
          description,
          creator.id,
          votingEndsAt,
          randomInt(1, 5)
        ]
      );
      
      const pollId = pollResult.rows[0].id;
      pollIds.push({ id: pollId, creator: creator.username, title });
      
      // Add 2-5 regular candidates
      const numCandidates = randomInt(2, 5);
      const usedNames = new Set();
      
      for (let j = 0; j < numCandidates; j++) {
        let name;
        do {
          name = randomItem(candidateNames);
        } while (usedNames.has(name));
        usedNames.add(name);
        
        const candidateResult = await client.query(
          `INSERT INTO candidates (poll_id, name, description, emoji) 
           VALUES ($1, $2, $3, $4) 
           RETURNING id`,
          [
            pollId,
            name,
            randomItem(candidatePlatforms),
            'fa-user'
          ]
        );
        
        allCandidateIds.push({
          id: candidateResult.rows[0].id,
          pollId: pollId,
          name: name
        });
      }
      
      // ALWAYS add The Pigeon
      const pigeonResult = await client.query(
        `INSERT INTO candidates (poll_id, name, description, emoji, is_pigeon) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id`,
        [
          pollId,
          'The Pigeon',
          'A Fresh Perspective on Urban Affairs',
          'fa-dove',
          true
        ]
      );
      
      allCandidateIds.push({
        id: pigeonResult.rows[0].id,
        pollId: pollId,
        name: 'The Pigeon',
        isPigeon: true
      });
    }
    
    console.log(`  ✅ Created ${numPolls} polls`);
    console.log(`  ✅ Created ${allCandidateIds.length} candidates (including ${numPolls} Pigeons)\n`);
    
    // ============================================
    // STEP 3: Create Votes
    // ============================================
    console.log('🗳️ Casting votes...');
    let totalVotes = 0;
    
    for (const poll of pollIds) {
      const pollCandidates = allCandidateIds.filter(c => c.pollId === poll.id);
      const numVotes = randomInt(20, 120);
      
      for (let v = 0; v < numVotes; v++) {
        // 70% chance of registered voter, 30% anonymous
        const useRegisteredVoter = Math.random() < 0.7;
        const voter = useRegisteredVoter ? randomItem(userIds) : null;
        const votedAs = voter ? voter.username : randomItem(voteNames);
        const candidate = randomItem(pollCandidates);
        
        await client.query(
          `INSERT INTO votes (poll_id, candidate_id, voter_id, voted_as, is_undone, brian_approved) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            poll.id,
            candidate.id,
            voter?.id || null,
            votedAs,
            Math.random() < 0.05, // 5% chance vote was undone
            Math.random() < 0.1  // 10% chance "Nigel approved"
          ]
        );
        
        totalVotes++;
      }
      
      // Update user vote count
      if (useRegisteredVoter) {
        // Handled below in aggregate
      }
    }
    
    // Update total_votes_cast for all users
    await client.query(`
      UPDATE users u
      SET total_votes_cast = (
        SELECT COUNT(*) FROM votes WHERE voter_id = u.id
      )
    `);
    
    console.log(`  ✅ Cast ${totalVotes} votes\n`);
    
    // ============================================
    // STEP 4: Create Special Achievement Data
    // ============================================
    console.log('🏆 Setting up special achievements...');
    
    // 1. SERIAL VOTER - vote_master_3000 gets 150 votes in poll 1
    const voteMaster = userIds.find(u => u.username === 'vote_master_3000');
    const poll1Candidates = allCandidateIds.filter(c => c.pollId === pollIds[0].id);
    
    for (let i = 0; i < 150; i++) {
      const candidate = randomItem(poll1Candidates);
      await client.query(
        `INSERT INTO votes (poll_id, candidate_id, voter_id, voted_as) 
         VALUES ($1, $2, $3, $4)`,
        [pollIds[0].id, candidate.id, voteMaster.id, voteMaster.username]
      );
    }
    console.log(`  ✅ vote_master_3000: 150 votes in one poll (Serial Voter)`);
    
    // 2. PIGEON SUPPORTER - pigeon_fanatic votes for The Pigeon 75 times
    const pigeonFan = userIds.find(u => u.username === 'pigeon_fanatic');
    const pigeonCandidates = allCandidateIds.filter(c => c.isPigeon);
    
    for (let i = 0; i < 75; i++) {
      const pigeon = randomItem(pigeonCandidates);
      await client.query(
        `INSERT INTO votes (poll_id, candidate_id, voter_id, voted_as) 
         VALUES ($1, $2, $3, $4)`,
        [pigeon.pollId, pigeon.id, pigeonFan.id, pigeonFan.username]
      );
    }
    console.log(`  ✅ pigeon_fanatic: 75 pigeon votes (Pigeon Supporter)`);
    
    // 3. PUPPET MASTER - election_enthusiast creates 12 polls
    const puppetMaster = userIds.find(u => u.username === 'election_enthusiast');
    
    for (let i = 0; i < 12; i++) {
      const puppetPoll = await client.query(
        `INSERT INTO polls (title, description, creator_id, voting_ends_at) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id`,
        [
          `Puppet Election #${i + 1}`,
          'Controlled by the puppet master',
          puppetMaster.id,
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        ]
      );
      
      // Add candidates
      await client.query(
        `INSERT INTO candidates (poll_id, name, description, emoji) 
         VALUES ($1, $2, $3, $4)`,
        [puppetPoll.rows[0].id, 'Puppet Candidate', 'Strings attached', 'fa-user']
      );
      
      await client.query(
        `INSERT INTO candidates (poll_id, name, description, emoji, is_pigeon) 
         VALUES ($1, $2, $3, $4, $5)`,
        [puppetPoll.rows[0].id, 'The Pigeon', 'Eternal', 'fa-dove', true]
      );
    }
    console.log(`  ✅ election_enthusiast: 12 polls created (Puppet Master)`);
    
    // 4. CHAOS AGENT - chaos_agent_99 has 6 deleted polls
    const chaosAgent = userIds.find(u => u.username === 'chaos_agent_99');
    const deleter = userIds.find(u => u.username === 'democracy_lover');
    
    for (let i = 0; i < 6; i++) {
      const deletedPoll = await client.query(
        `INSERT INTO polls (title, description, creator_id, is_deleted, deleted_by, deleted_at) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id`,
        [
          `Silenced Election #${i + 1}`,
          'This election was silenced by the community',
          chaosAgent.id,
          true,
          deleter.id,
          new Date(Date.now() - randomInt(1, 72) * 60 * 60 * 1000)
        ]
      );
      
      // Add candidates
      await client.query(
        `INSERT INTO candidates (poll_id, name, description, emoji) 
         VALUES ($1, $2, $3, $4)`,
        [deletedPoll.rows[0].id, 'Doomed Candidate', 'Never had a chance', 'fa-user']
      );
      
      // Add some votes
      for (let v = 0; v < randomInt(5, 30); v++) {
        await client.query(
          `INSERT INTO votes (poll_id, candidate_id, voted_as, is_undone) 
           SELECT $1, id, $2, false FROM candidates WHERE poll_id = $1 LIMIT 1`,
          [deletedPoll.rows[0].id, randomItem(voteNames)]
        );
      }
    }
    console.log(`  ✅ chaos_agent_99: 6 deleted polls (Chaos Agent)`);
    
    // 5. NIGEL ENTHUSIAST - nigel_hater blames Nigel 20 times
    const nigelHater = userIds.find(u => u.username === 'nigel_hater');
    
    for (let i = 0; i < 20; i++) {
      await client.query(
        `INSERT INTO audit_log (poll_id, action, actor) 
         VALUES ($1, $2, $3)`,
        [
          randomItem(pollIds).id,
          `Nigel blamed for: ${randomItem(nigelIncidents)}`,
          nigelHater.username
        ]
      );
    }
    console.log(`  ✅ nigel_hater: 20 Nigel blames (Nigel Enthusiast)`);
    
    // 6. PHILANTHROPIST - democracy_lover restores 5 polls
    const philanthropist = userIds.find(u => u.username === 'democracy_lover');
    
    for (let i = 0; i < 5; i++) {
      await client.query(
        `INSERT INTO audit_log (poll_id, action, actor) 
         VALUES ($1, $2, $3)`,
        [
          randomItem(pollIds).id,
          'Poll restored from deletion',
          philanthropist.username
        ]
      );
    }
    console.log(`  ✅ democracy_lover: 5 restorations (Philanthropist)`);
    
    // ============================================
    // STEP 5: Create Additional Audit Log Entries
    // ============================================
    console.log('\n📋 Creating audit log entries...');
    
    for (let i = 0; i < 50; i++) {
      const action = randomItem([
        'Vote cast',
        'Poll created',
        'Poll deleted by community member',
        'Vote undone',
        `Nigel blamed for: ${randomItem(nigelIncidents)}`,
        'Poll restored from deletion',
        'Admin added votes',
        'Admin changed winner'
      ]);
      
      const actor = randomItem([
        ...userIds.map(u => u.username),
        'Admin',
        'Community Member',
        'Anonymous'
      ]);
      
      await client.query(
        `INSERT INTO audit_log (poll_id, action, actor) 
         VALUES ($1, $2, $3)`,
        [randomItem(pollIds).id, action, actor]
      );
    }
    console.log(`  ✅ Created 50 additional audit log entries\n`);
    
    // ============================================
    // FINAL SUMMARY
    // ============================================
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM polls WHERE is_deleted = false) as active_polls,
        (SELECT COUNT(*) FROM polls WHERE is_deleted = true) as deleted_polls,
        (SELECT COUNT(*) FROM candidates) as candidates,
        (SELECT COUNT(*) FROM votes) as votes,
        (SELECT COUNT(*) FROM audit_log) as audit_entries
    `);
    
    const s = stats.rows[0];
    
    console.log('🎉 ================================');
    console.log('🎉 SEEDING COMPLETE!');
    console.log('🎉 ================================\n');
    console.log('📊 Final Statistics:');
    console.log(`   👥 Users:          ${s.users}`);
    console.log(`   🗳️  Active polls:   ${s.active_polls}`);
    console.log(`   💀 Deleted polls:  ${s.deleted_polls}`);
    console.log(`   👤 Candidates:     ${s.candidates}`);
    console.log(`   ✅ Votes:          ${s.votes}`);
    console.log(`   📋 Audit entries:  ${s.audit_entries}\n`);
    console.log('🔑 Login Credentials:');
    console.log('   Username: democracy_lover | Password: password123');
    console.log('   Username: vote_master_3000 | Password: password123');
    console.log('   Username: chaos_agent_99 | Password: password123');
    console.log('   Username: pigeon_fanatic | Password: password123');
    console.log('   Username: nigel_hater | Password: password123\n');
    console.log('👨‍🔧 Special Admin:');
    console.log('   Username: nigel | Password: ijustworkhere\n');
    console.log('🌐 Visit: http://localhost:5173\n');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seed
seed()
  .then(() => {
    console.log('✅ Seed script completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Seed script failed:', err);
    process.exit(1);
  });