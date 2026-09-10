import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function PollDetailPage() {
    const { id } = useParams()
    const { user, isAuthenticated } = useAuth()
    const [poll, setPoll] = useState(null)
    const [candidates, setCandidates] = useState([])
    const [selectedCandidate, setSelectedCandidate] = useState(null)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [hasVoted, setHasVoted] = useState(false)
    const [voteCount, setVoteCount] = useState(0)
    const [showResults, setShowResults] = useState(false)
    const [results, setResults] = useState(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteReason, setDeleteReason] = useState('')
    const [guiltLevel, setGuiltLevel] = useState('moderate')

  useEffect(() => {
    fetchPoll()
  }, [id])

  const fetchPoll = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/polls/${id}`)
      setPoll(response.data.poll)
      setCandidates(response.data.candidates)
      setLoading(false)
    } catch (err) {
      setError('Failed to load election. It may have been deleted by the community.')
      setLoading(false)
    }
  }

  
    // Add this function
    const handleDeletePoll = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/polls/${id}/community-delete`, {
        data: {
          deletedBy: user?.id || null,
          reason: deleteReason,
          guiltLevel: guiltLevel
        }
      })
      
      alert(response.data.message + ' ' + response.data.guilt)
      setShowDeleteConfirm(false)
      window.location.href = '/hall-of-shame'
      
    } catch (err) {
      alert('Failed to delete election. Democracy resists.')
    }
  }

  const handleVote = async () => {
    if (!selectedCandidate) {
      setMessage('Please select a candidate first.')
      return
    }
    
    setMessage('Transmitting vote securely...')
    
    try {
      const response = await axios.post(`http://localhost:3001/api/polls/${id}/vote`, {
        candidateId: selectedCandidate,
        voterId: user?.id || null,
        votedAs: user?.username || 'Anonymous Citizen'
      })
      
      setHasVoted(true)
      setVoteCount(prev => prev + 1)
      setMessage(response.data.message)
      
      fetchPoll()
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cast vote. Nigel is looking into it.')
    }
  }

  const handleVoteAgain = () => {
    setHasVoted(false)
    setSelectedCandidate(null)
    setMessage('Additional vote authorized. Democracy appreciates your enthusiasm.')
  }

  const fetchResults = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/polls/${id}/results`)
      setResults(response.data)
      setShowResults(true)
    } catch (err) {
      setError('Failed to fetch results. The counting machine is on strike.')
    }
  }

  if (loading) {
    return (
      <div className="official-card">
        <p style={{textAlign: 'center'}}>
          <i className="fas fa-spinner fa-spin"></i> Loading election...
        </p>
      </div>
    )
  }

  if (error && !poll) {
    return (
      <div className="official-card">
        <div style={{textAlign: 'center'}}>
          <i className="fas fa-exclamation-triangle" style={{fontSize: '3rem', color: '#8b1a1a'}}></i>
          <h2>Election Not Found</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">
            Return to Democracy
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="poll-detail-page">
      {!isAuthenticated && (
        <div className="official-notice warning" style={{marginBottom: '20px'}}>
          <p>
            <i className="fas fa-exclamation-triangle"></i>
            <strong> Voting Anonymously:</strong> Your vote will be recorded as "Anonymous Citizen". 
            Login to have your vote count toward achievements.
            <Link to="/login" style={{marginLeft: '10px', fontWeight: 'bold'}}>
              Login →
            </Link>
          </p>
        </div>
      )}
      <div className="official-card">
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
          <i className="fas fa-vote-yea" style={{fontSize: '3rem', color: '#1a3c6e'}}></i>
          <h2>{poll.title}</h2>
          {poll.description && <p style={{color: '#6b7280'}}>{poll.description}</p>}
          
          <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px'}}>
            <span className="badge">
                <i className="fas fa-clock"></i> {poll.voting_ends_at ? new Date(poll.voting_ends_at).toLocaleString() : 'Never ends'}
            </span>
            <span className="badge">
                <i className="fas fa-shield-alt"></i> Certified by TrustMeBro™
            </span>
            <Link to={`/admin/${poll.id}`} className="badge" style={{textDecoration: 'none', color: '#c9a84c'}}>
                <i className="fas fa-user-shield"></i> Admin Panel
            </Link>
            </div>
        </div>

        <div className="official-notice">
          <p>
            <i className="fas fa-info-circle"></i>
            <strong> Voting Instructions:</strong> Select one candidate below. You may vote 
            multiple times. You may change your vote. This is totally normal and how democracy works.
          </p>
        </div>

        {/* Candidates */}
        <div className="candidate-grid">
          {candidates.map(candidate => (
            <div 
              key={candidate.id}
              className={`candidate-card ${selectedCandidate === candidate.id ? 'selected' : ''}`}
              onClick={() => setSelectedCandidate(candidate.id)}
            >
              <div className="candidate-avatar">
                <i className={`fas ${candidate.emoji || 'fa-user'}`}></i>
              </div>
              <h3>{candidate.name}</h3>
              <p>{candidate.description || 'No platform provided'}</p>
              {candidate.is_pigeon && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: '#c9a84c',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '0.7rem'
                }}>
                  <i className="fas fa-dove"></i> Eternal Candidate
                </div>
              )}
              {selectedCandidate === candidate.id && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  color: '#4caf50',
                  fontSize: '1.2rem'
                }}>
                  <i className="fas fa-check-circle"></i>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Voting Actions */}
        <div style={{textAlign: 'center', marginTop: '30px'}}>
          {!hasVoted ? (
            <button 
              className="btn btn-primary"
              onClick={handleVote}
              disabled={!selectedCandidate}
              style={{fontSize: '1.1rem', padding: '15px 40px'}}
            >
              <i className="fas fa-check-circle"></i> Cast Vote
            </button>
          ) : (
            <div>
              <p style={{color: '#4caf50', marginBottom: '20px', fontSize: '1.2rem'}}>
                <i className="fas fa-check-circle"></i> {message}
              </p>
              <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                <button className="btn btn-primary" onClick={handleVoteAgain}>
                  <i className="fas fa-plus"></i> Vote Again
                </button>
                <button className="btn btn-secondary" onClick={fetchResults}>
                  <i className="fas fa-chart-bar"></i> View Results
                </button>
              </div>
            </div>
          )}
        </div>

        {message && !hasVoted && (
          <div className="official-notice" style={{marginTop: '20px'}}>
            <p><i className="fas fa-info-circle"></i> {message}</p>
          </div>
        )}

        {error && (
          <div className="official-notice warning" style={{marginTop: '20px'}}>
            <p><i className="fas fa-exclamation-circle"></i> {error}</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {showResults && results && (
        <div className="official-card">
          <h3>
            <i className="fas fa-chart-bar"></i> Live Results
          </h3>
          <p style={{fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic'}}>
            {results.note}
          </p>
          
          {results.results.map(candidate => (
            <div key={candidate.id} style={{marginBottom: '20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>
                  {candidate.name} {candidate.is_pigeon && '🐦'}
                </span>
                <span>{candidate.displayed_votes} votes</span>
              </div>
              <div className="integrity-bar" style={{height: '10px'}}>
                <div 
                  className="integrity-fill"
                  style={{
                    width: `${(candidate.displayed_votes / Math.max(...results.results.map(r => r.displayed_votes))) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
          
          <p style={{fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic', textAlign: 'center', marginTop: '15px'}}>
            Total votes displayed: {results.total_displayed}
            <br />
            (Actual votes may differ. Or not. We lost count.)
          </p>
        </div>
      )}

      
        <div className="official-card" style={{marginTop: '20px', background: '#fdf2f2'}}>
        <h3 style={{color: '#8b1a1a'}}>
            <i className="fas fa-exclamation-triangle"></i> Danger Zone
        </h3>
        <p style={{fontSize: '0.9rem', color: '#666'}}>
            As a community member, you have the power to silence democracy. Use wisely.
        </p>
        
        {!showDeleteConfirm ? (
            <button 
            className="btn btn-secondary" 
            style={{background: '#8b1a1a', color: 'white', borderColor: '#8b1a1a'}}
            onClick={() => setShowDeleteConfirm(true)}
            >
            <i className="fas fa-trash"></i> Delete This Election
            </button>
        ) : (
            <div style={{marginTop: '20px'}}>
            <p style={{color: '#8b1a1a', fontWeight: 'bold'}}>
                Are you sure you want to delete this election?
            </p>
            <p style={{fontSize: '0.85rem', color: '#666'}}>
                This action will silence the voices of {poll?.total_votes || 0} voters. 
                They trusted you. They believed in democracy.
            </p>
            
            <div className="form-group">
                <label>Reason for Deletion</label>
                <input
                type="text"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Why are you silencing democracy?"
                />
            </div>
            
            <div className="form-group">
                <label>How guilty do you feel?</label>
                <select value={guiltLevel} onChange={(e) => setGuiltLevel(e.target.value)}>
                <option value="none">Not guilty at all</option>
                <option value="slight">Slightly guilty</option>
                <option value="moderate">Moderately guilty</option>
                <option value="extreme">Extremely guilty</option>
                <option value="sociopath">I feel nothing</option>
                </select>
            </div>
            
            <div style={{display: 'flex', gap: '10px'}}>
                <button 
                className="btn btn-secondary" 
                style={{background: '#8b1a1a', color: 'white', borderColor: '#8b1a1a'}}
                onClick={handleDeletePoll}
                >
                <i className="fas fa-trash"></i> Confirm Deletion
                </button>
                <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                >
                <i className="fas fa-times"></i> Cancel (Chicken Out)
                </button>
            </div>
            </div>
        )}
        </div>
    </div>
  )
}

export default PollDetailPage