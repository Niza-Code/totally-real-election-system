import { useState, useEffect } from 'react'
import axios from 'axios'

function NigelPage() {
  const [data, setData] = useState(null)
  const [apology, setApology] = useState(null)
  const [excuse, setExcuse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNigel()
  }, [])

  const fetchNigel = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/nigel')
      setData(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load Nigel. He\'s probably unplugging something.')
      setLoading(false)
    }
  }

  const getApology = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/nigel/apology')
      setApology(response.data)
    } catch (err) {
      setError('Nigel isn\'t sorry right now.')
    }
  }

  const getExcuse = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/nigel/excuse')
      setExcuse(response.data)
    } catch (err) {
      setError('Nigel has run out of excuses.')
    }
  }

  if (loading) {
    return (
      <div className="official-card">
        <div style={{textAlign: 'center', padding: '50px'}}>
          <i className="fas fa-spinner fa-spin" style={{fontSize: '3rem', color: '#1a3c6e'}}></i>
          <p style={{marginTop: '20px', color: '#6b7280'}}>
            Locating Nigel...
          </p>
          <p style={{fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic'}}>
            (He was last seen near a power cable)
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="nigel-page">
      {/* Hero Section */}
      <div className="official-card" style={{
        background: 'linear-gradient(135deg, #1a3c6e 0%, #0a1e3d 100%)',
        color: 'white',
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative cables */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          fontSize: '3rem',
          opacity: 0.1,
          transform: 'rotate(15deg)'
        }}>
          <i className="fas fa-plug"></i>
        </div>
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          fontSize: '2rem',
          opacity: 0.1
        }}>
          <i className="fas fa-server"></i>
        </div>

        <div style={{textAlign: 'center', position: 'relative', zIndex: 1}}>
          <div style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #c9a84c, #8b6914)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            color: 'white',
            margin: '0 auto 20px',
            boxShadow: '0 8px 30px rgba(201, 168, 76, 0.4)',
            border: '4px solid rgba(255,255,255,0.2)'
          }}>
            <i className="fas fa-user-tie"></i>
          </div>
          <h1 style={{color: 'white', marginBottom: '10px'}}>Nigel</h1>
          <p style={{color: '#c9a84c', fontSize: '1.2rem', fontWeight: 'bold'}}>
            Server Administrator (Allegedly)
          </p>
          <p style={{color: '#b8c4d8', fontStyle: 'italic', maxWidth: '600px', margin: '15px auto'}}>
            "I'm doing my best. Please stop blaming me. Or don't. I'm used to it."
          </p>
          
          {/* Status Badges */}
          <div style={{display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '20px'}}>
            <span className="badge" style={{background: 'rgba(255,255,255,0.15)', color: 'white'}}>
              {data.current_mood.emoji} {data.current_mood.mood}
            </span>
            <span className="badge" style={{background: 'rgba(255,255,255,0.15)', color: 'white'}}>
              <i className="fas fa-map-marker-alt"></i> {data.current_location}
            </span>
            <span className="badge" style={{background: 'rgba(255,255,255,0.15)', color: 'white'}}>
              <i className="fas fa-tasks"></i> {data.current_activity}
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="official-card" style={{marginTop: '20px'}}>
        <h2><i className="fas fa-user-circle"></i> About Nigel</h2>
        <p>
          Nigel is our beloved Server Administrator. He has no formal IT training. 
          He was hired because he was the only person who answered the phone. 
          Nigel is doing his best. Nigel has unplugged the server 47 times this month. 
          We love Nigel anyway.
        </p>
        
        <div style={{
          background: '#f5f7fa',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '15px',
          borderLeft: '4px solid #c9a84c'
        }}>
          <p style={{margin: 0, fontStyle: 'italic', color: '#4a4a4a'}}>
            <strong>Did you know?</strong> Nigel was previously known as "Brian", but 
            due to a filing error, a server reboot, and a strongly-worded email from HR, 
            he legally changed his name. The Department of Democracy supports Nigel 
            in this transition.
          </p>
        </div>
      </div>

      {/* Nigel's Stats */}
      <div className="official-card" style={{marginTop: '20px'}}>
        <h2><i className="fas fa-chart-bar"></i> Nigel's Statistics</h2>
        <p style={{color: '#6b7280'}}>
          A completely accurate and totally not made-up record of Nigel's performance
        </p>
        
        <div className="stat-grid" style={{marginTop: '20px'}}>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#8b1a1a'}}>{data.nigel.total_blames}</div>
            <div className="stat-label">Times Blamed</div>
            <div className="hint">This month alone</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#ff9800'}}>{data.nigel.times_unplugged_server}</div>
            <div className="stat-label">Servers Unplugged</div>
            <div className="hint">"By accident"</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#9c27b0'}}>{data.nigel.coffee_spills}</div>
            <div className="stat-label">Coffee Spills</div>
            <div className="hint">On important equipment</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#4caf50'}}>{data.nigel.hours_slept_at_work}h</div>
            <div className="stat-label">Hours Slept at Work</div>
            <div className="hint">"Thinking"</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#1a3c6e'}}>{data.nigel.server_uptime}%</div>
            <div className="stat-label">Server Uptime</div>
            <div className="hint">When he remembers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#c9a84c'}}>{data.nigel.tickets_closed_by_accident}</div>
            <div className="stat-label">Tickets Closed by Accident</div>
            <div className="hint">"Resolved"</div>
          </div>
        </div>
      </div>

      {/* Nigel's Generators */}
      <div className="official-card" style={{marginTop: '20px'}}>
        <h2><i className="fas fa-comment-dots"></i> Nigel's Response Generator</h2>
        <p style={{color: '#6b7280'}}>
          Need an apology or excuse? Nigel has plenty.
        </p>
        
        <div style={{display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap'}}>
          <button className="btn btn-primary" onClick={getApology}>
            <i className="fas fa-hand-peace"></i> Get Apology
          </button>
          <button className="btn btn-secondary" onClick={getExcuse}>
            <i className="fas fa-question-circle"></i> Get Excuse
          </button>
        </div>

        {apology && (
          <div className="official-notice" style={{marginTop: '20px', borderLeftColor: '#4caf50'}}>
            <p style={{fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '10px'}}>
              "{apology.apology}"
            </p>
            <p style={{fontSize: '0.85rem', color: '#6b7280', margin: 0}}>
              {apology.nigel_signature}
            </p>
            <p style={{fontSize: '0.8rem', color: '#8b1a1a', marginTop: '5px'}}>
              P.S. {apology.note}
            </p>
          </div>
        )}

        {excuse && (
          <div className="official-notice warning" style={{marginTop: '20px'}}>
            <p style={{fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '10px'}}>
              "{excuse.excuse}"
            </p>
            <p style={{fontSize: '0.85rem', color: '#6b7280', margin: 0}}>
              Confidence: {excuse.confidence} | Accountability: {excuse.accountability}
            </p>
            <p style={{fontSize: '0.85rem', color: '#6b7280', marginTop: '5px'}}>
              {excuse.nigel_signature}
            </p>
          </div>
        )}
      </div>

      {/* Recent Blames */}
      <div className="official-card" style={{marginTop: '20px'}}>
        <h2><i className="fas fa-history"></i> Recent Blame History</h2>
        <p style={{color: '#6b7280'}}>
          What Nigel was blamed for recently
        </p>
        
        {data.recent_blames.length === 0 ? (
          <p style={{color: '#6b7280', fontStyle: 'italic'}}>
            No recent blames. Nigel is suspicious. Something must be up.
          </p>
        ) : (
          <div style={{marginTop: '15px'}}>
            {data.recent_blames.map((blame, index) => (
              <div key={index} style={{
                padding: '12px',
                borderBottom: '1px solid #e1e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{fontSize: '0.95rem'}}>{blame.action}</div>
                  <div style={{fontSize: '0.8rem', color: '#6b7280'}}>
                    Blamed by: <strong>{blame.actor}</strong>
                  </div>
                </div>
                <div style={{fontSize: '0.75rem', color: '#999', whiteSpace: 'nowrap'}}>
                  {new Date(blame.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Blamers */}
      {data.top_blamers.length > 0 && (
        <div className="official-card" style={{marginTop: '20px'}}>
          <h2><i className="fas fa-users"></i> Nigel's Biggest Critics</h2>
          <p style={{color: '#6b7280'}}>
            These citizens have blamed Nigel the most
          </p>
          
          <div style={{marginTop: '15px'}}>
            {data.top_blamers.map((blamer, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                borderBottom: '1px solid #e1e8f0'
              }}>
                <span>
                  <strong>#{index + 1}</strong> {blamer.username}
                </span>
                <span style={{color: '#8b1a1a'}}>
                  {blamer.blame_count} blames
                </span>
              </div>
            ))}
          </div>
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

export default NigelPage