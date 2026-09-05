import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function ResultsPage() {
  const [polls, setPolls] = useState([])
  const [selectedPoll, setSelectedPoll] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [recountCount, setRecountCount] = useState(0)

  useEffect(() => {
    fetchPolls()
  }, [])

  const fetchPolls = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/polls')
      setPolls(response.data.polls)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch elections. Democracy is temporarily unavailable.')
      setLoading(false)
    }
  }

  const fetchResults = async (pollId) => {
    setRefreshing(true)
    setError('')
    
    try {
      const response = await axios.get(`http://localhost:3001/api/polls/${pollId}/results`)
      setResults(response.data)
      setSelectedPoll(pollId)
      
      // Find the poll details
      const poll = polls.find(p => p.id === pollId)
      if (poll) {
        setSelectedPoll({...poll, ...response.data})
      }
      
      setRefreshing(false)
    } catch (err) {
      setError('Failed to fetch results. The counting machine is on strike.')
      setRefreshing(false)
    }
  }

  const handleRecount = async () => {
    setRecountCount(prev => prev + 1)
    setRefreshing(true)
    
    // Simulate recount delay
    setTimeout(() => {
      if (selectedPoll) {
        fetchResults(selectedPoll.id || selectedPoll)
      }
      setRefreshing(false)
    }, 2000)
  }

  const handleRefreshUntilHappy = () => {
    if (selectedPoll) {
      fetchResults(selectedPoll.id || selectedPoll)
    }
  }

  if (loading) {
    return (
      <div className="official-card">
        <div style={{textAlign: 'center', padding: '50px'}}>
          <i className="fas fa-spinner fa-spin" style={{fontSize: '3rem', color: '#1a3c6e'}}></i>
          <p style={{marginTop: '20px', color: '#6b7280'}}>
            Loading election results...
          </p>
          <p style={{fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic'}}>
            (Counting votes is harder than it looks)
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="results-page">
      <div className="official-card">
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
          <i className="fas fa-chart-bar" style={{fontSize: '3rem', color: '#1a3c6e'}}></i>
          <h2>Election Results Dashboard</h2>
          <p style={{color: '#6b7280'}}>
            Official Results - Certified by TrustMeBro™
          </p>
          {recountCount > 0 && (
            <p style={{fontSize: '0.8rem', color: '#8b1a1a', fontStyle: 'italic'}}>
              *Results recounted {recountCount} times. Numbers may or may not have changed.
            </p>
          )}
        </div>

        {/* Election List */}
        <h3>
          <i className="fas fa-list"></i> Available Elections
        </h3>
        <div style={{marginBottom: '30px'}}>
          {polls.length === 0 ? (
            <div className="official-notice">
              <p>
                <i className="fas fa-info-circle"></i> No elections found. 
                <Link to="/create" style={{marginLeft: '10px'}}>
                  Create one now
                </Link>
              </p>
            </div>
          ) : (
            <div style={{display: 'grid', gap: '10px'}}>
              {polls.map(poll => (
                <button
                  key={poll.id}
                  onClick={() => fetchResults(poll.id)}
                  className="btn btn-secondary"
                  style={{
                    justifyContent: 'space-between',
                    width: '100%',
                    textAlign: 'left',
                    background: selectedPoll?.id === poll.id ? '#e8edf5' : 'white'
                  }}
                >
                  <span>
                    <i className="fas fa-vote-yea"></i> {poll.title}
                  </span>
                  <span style={{fontSize: '0.8rem', color: '#6b7280'}}>
                    {poll.candidate_count} candidates | {poll.vote_count} votes
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Display */}
      {results && (
        <div className="official-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h3>
              <i className="fas fa-chart-pie"></i> {selectedPoll?.title || 'Election Results'}
            </h3>
            <div style={{display: 'flex', gap: '10px'}}>
              <button className="btn btn-secondary" onClick={handleRecount} disabled={refreshing}>
                <i className="fas fa-sync-alt"></i> Recount
              </button>
              <button className="btn btn-primary" onClick={handleRefreshUntilHappy} disabled={refreshing}>
                <i className="fas fa-redo"></i> Refresh Until Happy
              </button>
            </div>
          </div>

          {/* Brian Mode Indicator */}
          <div className="official-notice" style={{marginBottom: '20px'}}>
            <p>
              <i className="fas fa-robot"></i>
              <strong> Results Methodology:</strong> {results.note}
            </p>
          </div>

          {/* Results Bar Chart */}
          <div style={{marginBottom: '30px'}}>
            {results.results.map(candidate => (
              <div key={candidate.id} style={{marginBottom: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <strong>{candidate.name}</strong>
                    {candidate.is_pigeon && (
                      <span style={{
                        background: '#c9a84c',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        marginLeft: '10px'
                      }}>
                        🐦 Eternal
                      </span>
                    )}
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontWeight: 'bold', color: '#1a3c6e'}}>
                      {candidate.displayed_votes} votes
                    </div>
                    <div style={{fontSize: '0.7rem', color: '#6b7280'}}>
                      {Math.round((candidate.displayed_votes / Math.max(results.total_displayed, 1)) * 100)}%
                    </div>
                  </div>
                </div>
                <div className="integrity-bar" style={{height: '15px'}}>
                  <div 
                    className="integrity-fill"
                    style={{
                      width: `${(candidate.displayed_votes / Math.max(...results.results.map(r => r.displayed_votes))) * 100}%`,
                      background: candidate.is_pigeon ? 
                        'linear-gradient(90deg, #c9a84c, #8b6914)' : 
                        'linear-gradient(90deg, #1a3c6e, #2c5aa0)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-value">{results.total_displayed}</div>
              <div className="stat-label">Total Votes Counted*</div>
              <div className="hint">*Maybe</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{results.results.length}</div>
              <div className="stat-label">Candidates</div>
              <div className="hint">Including The Pigeon</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {Math.max(...results.results.map(r => r.displayed_votes))}
              </div>
              <div className="stat-label">Leading Vote Count</div>
              <div className="hint">Subject to change</div>
            </div>
          </div>

          {/* Suspicious Footer */}
          <div style={{marginTop: '20px', textAlign: 'center'}}>
            <p style={{fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic'}}>
              Results last updated: {new Date().toLocaleTimeString()}
              <br />
              (Actual results may vary. Or not. We're not really sure.)
            </p>
            <p style={{fontSize: '0.7rem', color: '#8b1a1a', marginTop: '10px'}}>
              <i className="fas fa-exclamation-triangle"></i> If these results seem incorrect, 
              please refresh until they look right.
            </p>
          </div>
        </div>
      )}

      {/* Helper Text */}
      {!results && !loading && (
        <div className="official-card">
          <div style={{textAlign: 'center', color: '#6b7280'}}>
            <i className="fas fa-mouse-pointer" style={{fontSize: '2rem'}}></i>
            <p style={{marginTop: '10px'}}>
              Select an election above to view its results
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="official-notice warning" style={{marginTop: '20px'}}>
          <p><i className="fas fa-exclamation-circle"></i> {error}</p>
        </div>
      )}
    </div>
  )
}

export default ResultsPage