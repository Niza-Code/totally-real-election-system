import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function LeaderboardsPage() {
  const [data, setData] = useState(null)
  const { isAuthenticated, user } = useAuth()
  const [achievements, setAchievements] = useState(null)
  const [legends, setLegends] = useState([])
  const [chaos, setChaos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('rankings')

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [leaderboardsRes, achievementsRes, legendsRes, chaosRes] = await Promise.all([
        axios.get('http://localhost:3001/api/leaderboards'),
        axios.get('http://localhost:3001/api/leaderboards/achievements'),
        axios.get('http://localhost:3001/api/leaderboards/hall-of-legends'),
        axios.get('http://localhost:3001/api/leaderboards/chaos')
      ])
      
      setData(leaderboardsRes.data)
      setAchievements(achievementsRes.data)
      setLegends(legendsRes.data.legends)
      setChaos(chaosRes.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load leaderboards. The rankings are being debated.')
      setLoading(false)
    }
  }

  const getMedalIcon = (index) => {
    if (index === 0) return <i className="fas fa-crown" style={{color: '#ffd700'}}></i>
    if (index === 1) return <i className="fas fa-medal" style={{color: '#c0c0c0'}}></i>
    if (index === 2) return <i className="fas fa-medal" style={{color: '#cd7f32'}}></i>
    return <span style={{color: '#999', fontWeight: 'bold'}}>#{index + 1}</span>
  }

  if (loading) {
    return (
      <div className="official-card">
        <div style={{textAlign: 'center', padding: '50px'}}>
          <i className="fas fa-trophy fa-spin" style={{fontSize: '3rem', color: '#c9a84c'}}></i>
          <p style={{marginTop: '20px', color: '#6b7280'}}>
            Calculating rankings...
          </p>
          <p style={{fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic'}}>
            (Democracy is competitive)
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="leaderboards-page">
        {!isAuthenticated && (
        <div className="official-notice" style={{marginBottom: '20px'}}>
          <p>
            <i className="fas fa-info-circle"></i>
            <strong> Tip:</strong> Only signed-in users appear in rankings. 
            Register or login to see yourself on the leaderboards.
          </p>
        </div>
      )}
      {/* Header */}
      <div className="official-card" style={{
        background: 'linear-gradient(135deg, #1a3c6e 0%, #0a1e3d 100%)',
        color: 'white',
        border: 'none'
      }}>
        <div style={{textAlign: 'center'}}>
          <i className="fas fa-trophy" style={{fontSize: '3rem', color: '#c9a84c'}}></i>
          <h2 style={{color: 'white', marginTop: '15px'}}>Leaderboards</h2>
          <p style={{color: '#b8c4d8'}}>
            Celebrating democracy's most dedicated (and chaotic) citizens
          </p>
          <p style={{color: '#8a9bb5', fontSize: '0.8rem', fontStyle: 'italic'}}>
            Rankings are final. Until someone complains. Then they change.
          </p>
        </div>
      </div>

      {/* Chaos Meter */}
      {chaos && (
        <div className="official-card" style={{marginTop: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px'}}>
            <div>
              <h3 style={{margin: 0}}>
                <i className="fas fa-fire"></i> Current Chaos Level
              </h3>
              <p style={{color: '#6b7280', fontSize: '0.9rem', margin: 0}}>
                {chaos.chaos_metrics.total_audit_events} events logged. Democracy in action.
              </p>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '15px 30px',
              background: chaos.chaos_level.color,
              color: 'white',
              borderRadius: '8px',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              {chaos.chaos_level.emoji} {chaos.chaos_level.level}
            </div>
          </div>
          
          <div className="stat-grid" style={{marginTop: '20px'}}>
            <div className="stat-card">
              <div className="stat-value">{chaos.chaos_metrics.deleted_polls}</div>
              <div className="stat-label">Polls Silenced</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{chaos.chaos_metrics.admin_votes}</div>
              <div className="stat-label">Admin Votes</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{chaos.chaos_metrics.pigeon_candidates}</div>
              <div className="stat-label">Pigeon Appearances</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{chaos.chaos_metrics.unique_voter_names}</div>
              <div className="stat-label">Unique Voters</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="official-card" style={{marginTop: '20px'}}>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <button 
            className={`btn ${activeTab === 'rankings' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('rankings')}
          >
            <i className="fas fa-list-ol"></i> Rankings
          </button>
          <button 
            className={`btn ${activeTab === 'achievements' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('achievements')}
          >
            <i className="fas fa-award"></i> Achievements
          </button>
          <button 
            className={`btn ${activeTab === 'legends' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('legends')}
          >
            <i className="fas fa-star"></i> Hall of Legends
          </button>
        </div>
      </div>

      {/* Rankings Tab */}
      {activeTab === 'rankings' && data && (
        <>
          {/* The Pigeon Stats */}
          <div className="official-card" style={{marginTop: '20px', background: '#fefbf5', borderLeft: '4px solid #c9a84c'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap'}}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#c9a84c',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                color: 'white'
              }}>
                <i className="fas fa-dove"></i>
              </div>
              <div style={{flex: 1}}>
                <h3 style={{margin: 0}}>The Pigeon - Eternal Candidate</h3>
                <p style={{color: '#6b7280', margin: '5px 0'}}>
                  Has appeared in {data.pigeon_stats.total_appearances} elections
                </p>
                <p style={{color: '#1a3c6e', fontWeight: 'bold', margin: 0}}>
                  {data.pigeon_stats.total_votes_received} votes received (somehow)
                </p>
              </div>
            </div>
          </div>

          {/* Most Votes Single Poll */}
          <div className="official-card" style={{marginTop: '20px'}}>
            <h3><i className="fas fa-fire"></i> Most Votes Cast (Single Poll)</h3>
            {data.most_votes_single_poll.length === 0 ? (
              <p style={{color: '#6b7280'}}>No data yet. Be the first to vote excessively!</p>
            ) : (
              data.most_votes_single_poll.map((entry, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderBottom: '1px solid #e1e8f0'
                }}>
                  <span>{getMedalIcon(index)} <strong>{entry.username}</strong></span>
                  <span style={{color: '#6b7280'}}>
                    {entry.vote_count} votes in "{entry.poll_title}"
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Most Votes All Time */}
          <div className="official-card" style={{marginTop: '20px'}}>
            <h3><i className="fas fa-chart-line"></i> Most Votes Cast (All Time)</h3>
            {data.most_votes_all_time.length === 0 ? (
              <p style={{color: '#6b7280'}}>No data yet.</p>
            ) : (
              data.most_votes_all_time.map((entry, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderBottom: '1px solid #e1e8f0'
                }}>
                  <span>{getMedalIcon(index)} <strong>{entry.username}</strong></span>
                  <span style={{color: '#6b7280'}}>{entry.vote_count} total votes</span>
                </div>
              ))
            )}
          </div>

          {/* Most Polls Created */}
          <div className="official-card" style={{marginTop: '20px'}}>
            <h3><i className="fas fa-plus-circle"></i> Most Elections Created</h3>
            {data.most_polls_created.length === 0 ? (
              <p style={{color: '#6b7280'}}>No data yet.</p>
            ) : (
              data.most_polls_created.map((entry, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderBottom: '1px solid #e1e8f0'
                }}>
                  <span>{getMedalIcon(index)} <strong>{entry.username}</strong></span>
                  <span style={{color: '#6b7280'}}>{entry.poll_count} elections</span>
                </div>
              ))
            )}
          </div>

          {/* Most Nigel Blamed */}
          <div className="official-card" style={{marginTop: '20px'}}>
            <h3><i className="fas fa-user-times"></i> Most Times Blamed Nigel</h3>
            {data.most_nigel_blamed.length === 0 ? (
              <p style={{color: '#6b7280'}}>Nigel has not been blamed yet. Impressive.</p>
            ) : (
              data.most_nigel_blamed.map((entry, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderBottom: '1px solid #e1e8f0'
                }}>
                  <span>{getMedalIcon(index)} <strong>{entry.username}</strong></span>
                  <span style={{color: '#8b1a1a'}}>{entry.blame_count} blames</span>
                </div>
              ))
            )}
          </div>

          {/* Most Active Voters */}
          <div className="official-card" style={{marginTop: '20px'}}>
            <h3><i className="fas fa-user-check"></i> Most Active Voters</h3>
            {data.most_active_voters.length === 0 ? (
              <p style={{color: '#6b7280'}}>No registered voters yet.</p>
            ) : (
              data.most_active_voters.map((entry, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderBottom: '1px solid #e1e8f0'
                }}>
                  <span>{getMedalIcon(index)} <strong>{entry.username}</strong></span>
                  <span style={{color: '#6b7280'}}>{entry.vote_count} votes</span>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && achievements && (
        <>
          <AchievementCard 
            title="First Vote" 
            icon="fa-check-circle"
            color="#4caf50"
            description="Cast your first vote. Welcome to democracy."
            achievers={achievements.first_vote}
            field="username"
          />
          
          <AchievementCard 
            title="Serial Voter" 
            icon="fa-repeat"
            color="#ff9800"
            description="Cast 100+ votes in a single poll. Impressive dedication."
            achievers={achievements.serial_voter}
            field="username"
            extraField={(entry) => `${entry.vote_count} votes`}
          />
          
          <AchievementCard 
            title="Puppet Master" 
            icon="fa-mask"
            color="#9c27b0"
            description="Created 10+ elections. You control the narrative."
            achievers={achievements.puppet_master}
            field="username"
            extraField={(entry) => `${entry.poll_count} elections`}
          />
          
          <AchievementCard 
            title="Chaos Agent" 
            icon="fa-bomb"
            color="#f44336"
            description="Had 5+ polls deleted. Your chaos knows no bounds."
            achievers={achievements.chaos_agent}
            field="username"
            extraField={(entry) => `${entry.deleted_count} deleted`}
          />
          
          <AchievementCard 
            title="Philanthropist" 
            icon="fa-hand-holding-heart"
            color="#e91e63"
            description="Restored 3+ deleted elections. A true defender of democracy."
            achievers={achievements.philanthropist}
            field="username"
            extraField={(entry) => `${entry.restore_count} restored`}
          />
          
          <AchievementCard 
            title="Nigel Enthusiast" 
            icon="fa-user-times"
            color="#795548"
            description="Blamed Nigel 10+ times. He's used to it by now."
            achievers={achievements.nigel_enthusiast}
            field="username"
            extraField={(entry) => `${entry.blame_count} blames`}
          />
          
          <AchievementCard 
            title="Pigeon Supporter" 
            icon="fa-dove"
            color="#c9a84c"
            description="Voted for The Pigeon 50+ times. The Pigeon thanks you."
            achievers={achievements.pigeon_supporter}
            field="username"
            extraField={(entry) => `${entry.pigeon_votes} votes`}
          />
        </>
      )}

      {/* Hall of Legends Tab */}
      {activeTab === 'legends' && (
        <div className="official-card" style={{marginTop: '20px'}}>
          <h3><i className="fas fa-star"></i> Hall of Legends</h3>
          <p style={{color: '#6b7280'}}>
            Citizens who have contributed most to our democracy (chaos)
          </p>
          
          {legends.length === 0 ? (
            <p style={{color: '#6b7280', textAlign: 'center', padding: '20px'}}>
              No legends yet. Be the first!
            </p>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid #1a3c6e'}}>
                    <th style={{padding: '10px', textAlign: 'left'}}>Rank</th>
                    <th style={{padding: '10px', textAlign: 'left'}}>Citizen</th>
                    <th style={{padding: '10px', textAlign: 'center'}}>Polls</th>
                    <th style={{padding: '10px', textAlign: 'center'}}>Votes</th>
                    <th style={{padding: '10px', textAlign: 'center'}}>Candidates</th>
                    <th style={{padding: '10px', textAlign: 'center'}}>Nigel Blames</th>
                    <th style={{padding: '10px', textAlign: 'center'}}>Restorations</th>
                  </tr>
                </thead>
                <tbody>
                  {legends.map((legend, index) => (
                    <tr key={index} style={{borderBottom: '1px solid #e1e8f0'}}>
                      <td style={{padding: '10px'}}>{getMedalIcon(index)}</td>
                      <td style={{padding: '10px'}}><strong>{legend.username}</strong></td>
                      <td style={{padding: '10px', textAlign: 'center'}}>{legend.polls_created}</td>
                      <td style={{padding: '10px', textAlign: 'center'}}>{legend.votes_cast}</td>
                      <td style={{padding: '10px', textAlign: 'center'}}>{legend.candidates_created}</td>
                      <td style={{padding: '10px', textAlign: 'center', color: '#8b1a1a'}}>{legend.nigel_blames}</td>
                      <td style={{padding: '10px', textAlign: 'center', color: '#4caf50'}}>{legend.restorations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="official-notice warning" style={{marginTop: '20px'}}>
          <p><i className="fas fa-exclamation-circle"></i> {error}</p>
        </div>
      )}
    </div>
  )
}

// Achievement Card Component
function AchievementCard({ title, icon, color, description, achievers, field, extraField }) {
  return (
    <div className="official-card" style={{marginTop: '20px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px'}}>
        <div style={{
          width: '50px',
          height: '50px',
          background: color,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.5rem'
        }}>
          <i className={`fas ${icon}`}></i>
        </div>
        <div>
          <h3 style={{margin: 0}}>{title}</h3>
          <p style={{color: '#6b7280', margin: 0, fontSize: '0.9rem'}}>{description}</p>
        </div>
      </div>
      
      {achievers.length === 0 ? (
        <p style={{color: '#6b7280', fontStyle: 'italic'}}>
          No one has earned this achievement yet. Be the first!
        </p>
      ) : (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
          {achievers.map((achiever, index) => (
            <div key={index} style={{
              background: '#f5f7fa',
              padding: '8px 15px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              border: '1px solid #e1e8f0'
            }}>
              <strong>{achiever[field]}</strong>
              {extraField && <span style={{color: '#6b7280'}}> ({extraField(achiever)})</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LeaderboardsPage