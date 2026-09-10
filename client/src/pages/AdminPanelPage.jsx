import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function AdminPanelPage() {
  const { pollId } = useParams()
  const [poll, setPoll] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [auditLog, setAuditLog] = useState([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [systemStatus, setSystemStatus] = useState(null)
  const [nigelMood, setNigelMood] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  // Manipulation form states
  const [selectedCandidate, setSelectedCandidate] = useState('')
  const [voteCount, setVoteCount] = useState(100)
  const [reason, setReason] = useState('Enhancing democracy')
  const [victoryMessage, setVictoryMessage] = useState('The people have spoken!')

  useEffect(() => {
    fetchAdminData()
  }, [pollId])

  const fetchAdminData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/admin/dashboard/${pollId}`)
      setPoll(response.data.poll)
      setCandidates(response.data.candidates)
      setAuditLog(response.data.audit_log)
      setTotalVotes(response.data.total_votes)
      setSystemStatus(response.data.system_status)
      setNigelMood(response.data.nigel_mood)
      setLoading(false)
    } catch (err) {
      setError('Failed to load admin panel. Nigel is not cooperating.')
      setLoading(false)
    }
  }

  const handleAction = async (action, data) => {
    setMessage('Processing...')
    setError('')
    
    try {
      const response = await axios.post(`http://localhost:3001/api/admin/${action}`, {
        pollId: parseInt(pollId),
        ...data
      })
      
      setMessage(response.data.message)
      fetchAdminData() // Refresh data
      
    } catch (err) {
      setError(err.response?.data?.error || 'Action failed. Nigel strikes again.')
    }
  }

  if (loading) {
    return (
      <div className="official-card">
        <div style={{textAlign: 'center', padding: '50px'}}>
          <i className="fas fa-spinner fa-spin" style={{fontSize: '3rem', color: '#1a3c6e'}}></i>
          <p style={{marginTop: '20px', color: '#6b7280'}}>
            Accessing control room...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel-page">
      {/* Header */}
      <div className="official-card" style={{
        background: 'linear-gradient(135deg, #1a3c6e 0%, #0a1e3d 100%)',
        color: 'white',
        border: 'none'
      }}>
        <div style={{textAlign: 'center'}}>
          <i className="fas fa-user-shield" style={{fontSize: '3rem', color: '#c9a84c'}}></i>
          <h2 style={{color: 'white', marginTop: '15px'}}>Election Control Center</h2>
          <p style={{color: '#b8c4d8'}}>
            With great power comes absolutely no oversight
          </p>
          <p style={{color: '#8a9bb5', fontSize: '0.8rem', fontStyle: 'italic'}}>
            Admin access granted. Trust level: Absolute.
          </p>
        </div>
      </div>

      {/* System Status */}
      <div className="stat-grid" style={{marginTop: '20px'}}>
        <div className="stat-card">
          <div className="stat-value" style={{color: systemStatus?.color || '#1a3c6e'}}>
            <i className={`fas ${systemStatus?.icon || 'fa-question'}`}></i>
          </div>
          <div className="stat-label">System Status</div>
          <div className="hint">{systemStatus?.status || 'Unknown'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalVotes}</div>
          <div className="stat-label">Total Votes</div>
          <div className="hint">(Questionably obtained)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            <i className="fas fa-user"></i>
          </div>
          <div className="stat-label">Nigel's Mood</div>
          <div className="hint">{nigelMood}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="official-card" style={{marginTop: '20px'}}>
        <h3>
          <i className="fas fa-bolt"></i> Quick Actions
        </h3>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '20px'}}>
          <button className="btn btn-primary" onClick={() => handleAction('change-winner', { 
            candidateId: selectedCandidate || candidates[0]?.id 
          })}>
            <i className="fas fa-crown"></i> Change Winner
          </button>
          
          <button className="btn btn-secondary" onClick={() => handleAction('delete-evidence', {})}>
            <i className="fas fa-eraser"></i> Delete Evidence
          </button>
          
          <button className="btn btn-secondary" onClick={() => handleAction('blame-nigel', { 
            incident: 'General incompetence' 
          })}>
            <i className="fas fa-user-times"></i> Blame Nigel
          </button>
          
          <button className="btn btn-secondary" onClick={() => handleAction('declare-victory', {
            candidateId: selectedCandidate || candidates[0]?.id,
            victoryMessage
          })}>
            <i className="fas fa-flag"></i> Declare Victory
          </button>
          
          <button className="btn btn-secondary" onClick={() => handleAction('reset', {})}>
            <i className="fas fa-undo"></i> Reset Election
          </button>
        </div>
      </div>

      {/* Vote Manipulation */}
      <div className="official-card" style={{marginTop: '20px'}}>
        <h3>
          <i className="fas fa-chart-line"></i> Vote Manipulation
        </h3>
        
        <div className="form-group">
          <label>Select Candidate</label>
          <select 
            value={selectedCandidate} 
            onChange={(e) => setSelectedCandidate(e.target.value)}
            style={{width: '100%', padding: '12px', borderRadius: '4px', border: '2px solid #d1d8e0'}}
          >
            <option value="">Select candidate...</option>
            {candidates.map(candidate => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name} ({candidate.vote_count} votes)
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Number of Votes</label>
          <input
            type="number"
            value={voteCount}
            onChange={(e) => setVoteCount(parseInt(e.target.value))}
            min="1"
          />
        </div>
        
        <div className="form-group">
          <label>Reason (for the record*)</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enhancing democracy"
          />
          <div className="hint">*Record may be deleted at any time</div>
        </div>
        
        <div style={{display: 'flex', gap: '10px'}}>
          <button 
            className="btn btn-primary" 
            onClick={() => handleAction('add-votes', {
              candidateId: selectedCandidate,
              count: voteCount,
              reason
            })}
            disabled={!selectedCandidate}
          >
            <i className="fas fa-plus"></i> Add Votes
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => handleAction('remove-votes', {
              candidateId: selectedCandidate,
              count: voteCount,
              reason
            })}
            disabled={!selectedCandidate}
          >
            <i className="fas fa-minus"></i> Remove Votes
          </button>
        </div>
      </div>

      {/* Current Results */}
      <div className="official-card" style={{marginTop: '20px'}}>
        <h3>
          <i className="fas fa-chart-bar"></i> Current Results
        </h3>
        
        {candidates.map(candidate => (
          <div key={candidate.id} style={{marginBottom: '15px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>{candidate.name}</span>
              <span>{candidate.vote_count} votes</span>
            </div>
            <div className="integrity-bar" style={{height: '10px'}}>
              <div 
                className="integrity-fill"
                style={{
                  width: `${(candidate.vote_count / Math.max(...candidates.map(c => c.vote_count), 1)) * 100}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log */}
      <div className="official-card" style={{marginTop: '20px'}}>
        <h3>
          <i className="fas fa-scroll"></i> Audit Log
        </h3>
        <p style={{fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic'}}>
          Complete record of all actions taken. (May be incomplete.)
        </p>
        
        <div style={{maxHeight: '300px', overflowY: 'auto', marginTop: '15px'}}>
          {auditLog.length === 0 ? (
            <p style={{color: '#6b7280', textAlign: 'center'}}>
              No actions logged. Suspiciously clean.
            </p>
          ) : (
            auditLog.map((entry, index) => (
              <div key={index} style={{
                padding: '10px',
                borderBottom: '1px solid #e1e8f0',
                fontSize: '0.85rem'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span><strong>{entry.action}</strong></span>
                  <span style={{color: '#6b7280'}}>
                    {new Date(entry.created_at).toLocaleString()}
                  </span>
                </div>
                <div style={{color: '#6b7280', fontSize: '0.75rem'}}>
                  Actor: {entry.actor}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="official-notice" style={{marginTop: '20px', borderLeftColor: '#4caf50'}}>
          <p><i className="fas fa-check-circle"></i> {message}</p>
        </div>
      )}
      
      {error && (
        <div className="official-notice warning" style={{marginTop: '20px'}}>
          <p><i className="fas fa-exclamation-circle"></i> {error}</p>
        </div>
      )}

      {/* Back Link */}
      <div style={{textAlign: 'center', marginTop: '20px'}}>
        <Link to={`/poll/${pollId}`} className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Back to Election
        </Link>
      </div>
    </div>
  )
}

export default AdminPanelPage