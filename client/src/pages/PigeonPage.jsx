import { useState, useEffect } from 'react'
import axios from 'axios'

function PigeonPage() {
  const [data, setData] = useState(null)
  const [promises, setPromises] = useState(null)
  const [endorsements, setEndorsements] = useState(null)
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPigeon()
  }, [])

  const fetchPigeon = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/pigeon')
      setData(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load The Pigeon. He flew away.')
      setLoading(false)
    }
  }

  const fetchPromises = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/pigeon/promises')
      setPromises(response.data)
    } catch (err) {
      setError('The Pigeon refuses to make promises.')
    }
  }

  const fetchEndorsements = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/pigeon/endorsements')
      setEndorsements(response.data)
    } catch (err) {
      setError('No one endorses The Pigeon. Except other pigeons.')
    }
  }

  const fetchQuote = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/pigeon/quote')
      setQuote(response.data)
    } catch (err) {
      setError('The Pigeon has no comment.')
    }
  }

  if (loading) {
    return (
      <div className="official-card">
        <div style={{textAlign: 'center', padding: '50px'}}>
          <i className="fas fa-dove fa-spin" style={{fontSize: '3rem', color: '#c9a84c'}}></i>
          <p style={{marginTop: '20px', color: '#6b7280'}}>
            Locating The Pigeon...
          </p>
          <p style={{fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic'}}>
            (He's probably on a statue somewhere)
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="pigeon-page">
      {/* Hero Section */}
      <div className="official-card" style={{
        background: 'linear-gradient(135deg, #c9a84c 0%, #8b6914 100%)',
        color: 'white',
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative pigeons */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontSize: '2rem',
          opacity: 0.15
        }}>
          🐦
        </div>
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '30px',
          fontSize: '1.5rem',
          opacity: 0.15
        }}>
          🐦
        </div>
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          fontSize: '2.5rem',
          opacity: 0.15
        }}>
          🐦
        </div>

        <div style={{textAlign: 'center', position: 'relative', zIndex: 1}}>
          <div style={{
            width: '140px',
            height: '140px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '5rem',
            margin: '0 auto 20px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            border: '4px solid rgba(255,255,255,0.5)'
          }}>
            🐦
          </div>
          <h1 style={{color: 'white', marginBottom: '10px'}}>The Pigeon</h1>
          <p style={{color: '#fff8e1', fontSize: '1.2rem', fontWeight: 'bold'}}>
            Eternal Candidate for Everything
          </p>
          <p style={{color: '#fff8e1', fontStyle: 'italic', maxWidth: '600px', margin: '15px auto', opacity: 0.9}}>
            "Coo." <br />
            <span style={{fontSize: '0.85em'}}>(Translation: "Vote for me or don't. I'll be here anyway.")</span>
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginTop: '20px'
          }}>
            <span className="badge" style={{background: 'rgba(255,255,255,0.2)', color: 'white'}}>
              <i className="fas fa-infinity"></i> Eternal Candidate
            </span>
            <span className="badge" style={{background: 'rgba(255,255,255,0.2)', color: 'white'}}>
              <i className="fas fa-crown"></i> Undefeated
            </span>
          </div>
        </div>
      </div>

      {/* The Pigeon's Platform */}
      <div className="official-card" style={{marginTop: '20px'}}>
        <h2><i className="fas fa-scroll"></i> The Pigeon's Platform</h2>
        <div style={{
          background: '#fefbf5',
          padding: '20px',
          borderRadius: '8px',
          borderLeft: '4px solid #c9a84c',
          marginTop: '15px'
        }}>
          <p style={{fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '15px'}}>
            "A Fresh Perspective on Urban Affairs"
          </p>
          <p>
            The Pigeon has been a fixture of public spaces for thousands of years. 
            He has sat on more statues, eaten more breadcrumbs, and pooped on more 
            important monuments than any human candidate. The Pigeon believes in:
          </p>
          <ul style={{marginTop: '15px', paddingLeft: '20px'}}>
            <li style={{marginBottom: '8px'}}>Universal access to breadcrumbs</li>
            <li style={{marginBottom: '8px'}}>Better park benches (for sitting)</li>
            <li style={{marginBottom: '8px'}}>Fewer cats (controversial, but necessary)</li>
            <li style={{marginBottom: '8px'}}>More statues (for sitting)</li>
            <li style={{marginBottom: '8px'}}>Abolition of windshield wipers</li>
          </ul>
          <p style={{marginTop: '15px', fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic'}}>
            Note: The Pigeon has no actual policies. The Pigeon is a pigeon.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="official-card" style={{marginTop: '20px'}}>
        <h2><i className="fas fa-chart-bar"></i> The Pigeon's Statistics</h2>
        
        <div className="stat-grid" style={{marginTop: '20px'}}>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#c9a84c'}}>
              {data.stats.total_appearances}
            </div>
            <div className="stat-label">Elections Contested</div>
            <div className="hint">And counting</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#1a3c6e'}}>
              {data.stats.total_votes}
            </div>
            <div className="stat-label">Votes Received</div>
            <div className="hint">Somehow</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#4caf50'}}>
              {data.stats.winning_elections}
            </div>
            <div className="stat-label">Elections Won</div>
            <div className="hint">Allegedly</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#ff9800'}}>
              {data.stats.approval_rating}%
            </div>
            <div className="stat-label">Approval Rating</div>
            <div className="hint">Based on vibes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#9c27b0'}}>
              {data.stats.promises_made}
            </div>
            <div className="stat-label">Promises Made</div>
            <div className="hint">All unverifiable</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color: '#8b1a1a'}}>
              {data.stats.promises_kept}
            </div>
            <div className="stat-label">Promises Kept</div>
            <div className="hint">Unsurprising</div>
          </div>
        </div>
      </div>

      {/* Campaign Generators */}
      <div className="official-card" style={{marginTop: '20px'}}>
        <h2><i className="fas fa-bullhorn"></i> Campaign Center</h2>
        <p style={{color: '#6b7280'}}>
          Generate campaign content from The Pigeon's team
        </p>
        
        <div style={{display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap'}}>
          <button className="btn btn-primary" onClick={fetchPromises}>
            <i className="fas fa-handshake"></i> Get Campaign Promises
          </button>
          <button className="btn btn-secondary" onClick={fetchEndorsements}>
            <i className="fas fa-users"></i> Get Endorsements
          </button>
          <button className="btn btn-gold" onClick={fetchQuote}>
            <i className="fas fa-comment"></i> Pigeon Quote Generator
          </button>
        </div>

        {promises && (
          <div className="official-notice" style={{marginTop: '20px', borderLeftColor: '#c9a84c'}}>
            <h4 style={{marginBottom: '15px'}}>📢 Official Campaign Promises</h4>
            {promises.promises.map((p, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #f0e6c8'
              }}>
                <span>• {p.promise}</span>
                <span style={{fontSize: '0.85rem', color: '#6b7280'}}>{p.status}</span>
              </div>
            ))}
            <p style={{fontSize: '0.8rem', color: '#8b1a1a', marginTop: '15px', fontStyle: 'italic'}}>
              {promises.disclaimer}
            </p>
          </div>
        )}

        {endorsements && (
          <div className="official-notice" style={{marginTop: '20px', borderLeftColor: '#4caf50'}}>
            <h4 style={{marginBottom: '15px'}}>🎭 Endorsements</h4>
            {endorsements.endorsements.map((e, index) => (
              <div key={index} style={{
                marginBottom: '15px',
                padding: '10px',
                background: 'white',
                borderRadius: '6px'
              }}>
                <p style={{fontStyle: 'italic', marginBottom: '5px'}}>"{e.quote}"</p>
                <p style={{fontSize: '0.85rem', color: '#6b7280', margin: 0}}>— {e.from}</p>
              </div>
            ))}
            <p style={{fontSize: '0.8rem', color: '#8b1a1a', marginTop: '15px', fontStyle: 'italic'}}>
              {endorsements.note}
            </p>
          </div>
        )}

        {quote && (
          <div className="official-notice" style={{marginTop: '20px', borderLeftColor: '#c9a84c', textAlign: 'center'}}>
            <p style={{fontSize: '2rem', margin: '20px 0', fontWeight: 'bold'}}>
              "{quote.quote}"
            </p>
            <p style={{fontSize: '0.9rem', color: '#6b7280', fontStyle: 'italic'}}>
              {quote.translation}
            </p>
            <p style={{fontSize: '0.85rem', color: '#6b7280', marginTop: '10px'}}>
              {quote.pigeon_signature}
            </p>
          </div>
        )}
      </div>

      {/* Recent Pigeon Votes */}
      <div className="official-card" style={{marginTop: '20px'}}>
        <h2><i className="fas fa-vote-yea"></i> Recent Pigeon Support</h2>
        <p style={{color: '#6b7280'}}>
          Citizens who recently voted for The Pigeon
        </p>
        
        {data.recent_votes.length === 0 ? (
          <p style={{color: '#6b7280', fontStyle: 'italic'}}>
            No recent votes. The Pigeon is disappointed but not surprised.
          </p>
        ) : (
          <div style={{marginTop: '15px'}}>
            {data.recent_votes.map((vote, index) => (
              <div key={index} style={{
                padding: '10px',
                borderBottom: '1px solid #e1e8f0'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>
                    <strong>{vote.voted_as}</strong> voted for The Pigeon
                  </span>
                  <span style={{fontSize: '0.75rem', color: '#999'}}>
                    {new Date(vote.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div style={{fontSize: '0.8rem', color: '#6b7280'}}>
                  in "{vote.poll_title}"
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Supporters */}
      {data.top_supporters.length > 0 && (
        <div className="official-card" style={{marginTop: '20px'}}>
          <h2><i className="fas fa-heart"></i> The Pigeon's Biggest Fans</h2>
          <p style={{color: '#6b7280'}}>
            Citizens who have voted for The Pigeon the most
          </p>
          
          <div style={{marginTop: '15px'}}>
            {data.top_supporters.map((supporter, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                borderBottom: '1px solid #e1e8f0'
              }}>
                <span>
                  <strong>#{index + 1}</strong> {supporter.username}
                </span>
                <span style={{color: '#c9a84c'}}>
                  {supporter.pigeon_votes} pigeon votes
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="official-notice warning" style={{marginTop: '20px'}}>
        <p>
          <i className="fas fa-info-circle"></i>
          <strong> Important Note:</strong> The Pigeon is a bird. The Pigeon cannot 
          hold office, make laws, or understand the concept of democracy. 
          The Pigeon's candidacy is symbolic. Or maybe not. We're not really sure anymore.
        </p>
      </div>

      {error && (
        <div className="official-notice warning" style={{marginTop: '20px'}}>
          <p><i className="fas fa-exclamation-circle"></i> {error}</p>
        </div>
      )}
    </div>
  )
}

export default PigeonPage