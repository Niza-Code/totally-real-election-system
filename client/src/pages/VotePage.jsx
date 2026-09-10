import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

function VotePage() {
  const { user, isAuthenticated } = useAuth()
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Uncle Bob',
      platform: 'Experienced Leadership for a Digital Age',
      icon: 'fa-user-tie',
      votes: 0
    },
    {
      id: 2,
      name: 'The Pigeon',
      platform: 'A Fresh Perspective on Urban Affairs',
      icon: 'fa-dove',
      votes: 0
    },
    {
      id: 3,
      name: 'The CSS Developer',
      platform: 'Will Center the Div, Probably',
      icon: 'fa-code',
      votes: 0
    },
    {
      id: 4,
      name: 'Nobody',
      platform: 'Results Pending',
      icon: 'fa-ghost',
      votes: 0
    }
  ])
  
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteCount, setVoteCount] = useState(0)
  const [message, setMessage] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidate(candidateId)
    setMessage('')
  }

  const handleVoteSubmit = async () => {
    if (!selectedCandidate) {
      setMessage('Please select a candidate to cast your vote.')
      return
    }
    
    setIsSubmitting(true)
    setMessage('')
    
    try {
      const response = await axios.post('http://localhost:3001/api/polls/1/vote', {
        candidateId: selectedCandidate,
        voterId: user?.id || null,
        votedAs: user?.username || 'Anonymous Citizen'
      })
      
      setVoteCount(prev => prev + 1)
      setHasVoted(true)
      setIsSubmitting(false)
      setMessage(response.data.message)
      
    } catch (err) {
      setError('Failed to cast vote. Brian is looking into it.')
      setIsSubmitting(false)
    }
  }

  const handleUndoVote = () => {
    setHasVoted(false)
    setSelectedCandidate(null)
    setVoteCount(prev => Math.max(0, prev - 1))
    setMessage('Your vote has been rescinded. Democracy appreciates your flexibility.')
  }

  const handleVoteAgain = () => {
    setHasVoted(false)
    setSelectedCandidate(null)
    setMessage('Previous vote retained. You may now cast an additional vote. (This is totally normal.)')
  }

  return (
    <div className="vote-page">
      {!isAuthenticated && (
        <div className="official-notice warning" style={{marginBottom: '20px'}}>
          <p>
            <i className="fas fa-exclamation-triangle"></i>
            <strong> Not Signed In:</strong> Your vote will be recorded as "Anonymous Citizen" 
            and won't count toward your personal achievements. 
            <Link to="/login" style={{marginLeft: '10px', fontWeight: 'bold'}}>
              Login to vote officially →
            </Link>
          </p>
        </div>
      )}
      
      {isAuthenticated && (
        <div className="official-notice" style={{marginBottom: '20px', borderLeftColor: '#4caf50'}}>
          <p>
            <i className="fas fa-check-circle" style={{color: '#4caf50'}}></i>
            <strong> Signed in as {user.username}.</strong> Your votes will count toward your achievements.
          </p>
        </div>
      )}
      <div className="official-card">
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
          <i className="fas fa-vote-yea" style={{fontSize: '3rem', color: '#1a3c6e'}}></i>
          <h2 style={{marginTop: '15px'}}>Official Ballot</h2>
          <p style={{color: '#6b7280'}}>
            Election: Supreme Leader of the Internet
          </p>
          <p style={{color: '#6b7280', fontSize: '0.9rem'}}>
            Term Length: Until someone else wins
          </p>
        </div>

        <div className="official-notice">
          <p>
            <i className="fas fa-info-circle"></i>
            <strong> Voting Instructions:</strong> Select one candidate below. You may change 
            your vote at any time. You may vote multiple times. This is perfectly normal and 
            totally how democracy works.
          </p>
        </div>

        {/* Candidate Grid */}
        <div className="candidate-grid">
          {candidates.map(candidate => (
            <div 
              key={candidate.id}
              className={`candidate-card ${selectedCandidate === candidate.id ? 'selected' : ''}`}
              onClick={() => handleCandidateSelect(candidate.id)}
            >
              <div className="candidate-avatar">
                <i className={`fas ${candidate.icon}`}></i>
              </div>
              <h3>{candidate.name}</h3>
              <p>{candidate.platform}</p>
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
              onClick={handleVoteSubmit}
              disabled={isSubmitting || !selectedCandidate}
              style={{fontSize: '1.1rem', padding: '15px 40px'}}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Transmitting Vote Securely...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i> Cast Vote
                </>
              )}
            </button>
          ) : (
            <div>
              <p style={{color: '#4caf50', marginBottom: '20px', fontSize: '1.2rem'}}>
                <i className="fas fa-check-circle"></i> Vote Recorded Successfully
              </p>
              <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                <button className="btn btn-secondary" onClick={handleUndoVote}>
                  <i className="fas fa-undo"></i> Undo Vote
                </button>
                <button className="btn btn-primary" onClick={handleVoteAgain}>
                  <i className="fas fa-plus"></i> Vote Again
                </button>
              </div>
            </div>
          )}
        </div>

        {message && (
          <div className="official-notice" style={{
            marginTop: '20px',
            borderLeftColor: message.includes('recorded') ? '#4caf50' : '#c9a84c'
          }}>
            <p><i className="fas fa-info-circle"></i> {message}</p>
          </div>
        )}

        {/* Vote Counter */}
        <div style={{textAlign: 'center', marginTop: '30px'}}>
          <p style={{color: '#6b7280', fontSize: '0.9rem'}}>
            Votes cast this session: <strong>{voteCount}</strong>
          </p>
          <p style={{color: '#6b7280', fontSize: '0.8rem', fontStyle: 'italic'}}>
            (Other voters may be experiencing delays. Or not. We don't really know.)
          </p>
        </div>
      </div>

      {/* Results Preview */}
      <div className="official-card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h3>
            <i className="fas fa-chart-bar"></i> Live Results
          </h3>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowResults(!showResults)}
          >
            {showResults ? 'Hide Results' : 'View Results'}
          </button>
        </div>
        
        {showResults && (
          <div style={{marginTop: '20px'}}>
            {candidates.map(candidate => (
              <div key={candidate.id} style={{marginBottom: '15px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>{candidate.name}</span>
                  <span>{candidate.votes} votes</span>
                </div>
                <div className="integrity-bar" style={{height: '10px'}}>
                  <div 
                    className="integrity-fill"
                    style={{width: `${(candidate.votes / Math.max(...candidates.map(c => c.votes))) * 100}%`}}
                  />
                </div>
              </div>
            ))}
            <p style={{fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic', textAlign: 'center', marginTop: '15px'}}>
              Results are updated in real-time. (Or whenever Brian remembers to plug in the server.)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VotePage