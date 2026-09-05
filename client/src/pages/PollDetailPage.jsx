import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function PollDetailPage() {
  const { id } = useParams()
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

  const handleVote = async () => {
    if (!selectedCandidate) {
      setMessage('Please select a candidate first.')
      return
    }
    
    setMessage('Transmitting vote securely...')
    
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || 'null')
      
      const response = await axios.post(`http://localhost:3001/api/polls/${id}/vote`, {
        candidateId: selectedCandidate,
        voterId: userData?.id || null,
        votedAs: userData?.username || 'Anonymous Citizen'
      })
      
      const candidate = candidates.find(c => c.id === selectedCandidate)
      setHasVoted(true)
      setVoteCount(prev => prev + 1)
      setMessage(response.data.message)
      
      // Refresh poll data
      fetchPoll()
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cast vote. Brian is looking into it.')
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
    </div>
  )
}

export default PollDetailPage