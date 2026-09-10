import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function HallOfShamePage() {
  const [deletedPolls, setDeletedPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [restoring, setRestoring] = useState(null)

  useEffect(() => {
    fetchDeletedPolls()
  }, [])

  const fetchDeletedPolls = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/polls/hall-of-shame')
      setDeletedPolls(response.data.deleted_polls)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch deleted elections. Even the dead are hiding.')
      setLoading(false)
    }
  }

  const handleRestore = async (pollId) => {
    setRestoring(pollId)
    setError('')
    
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || 'null')
      
      const response = await axios.post(`http://localhost:3001/api/polls/${pollId}/restore`, {
        restoredBy: userData?.id || null
      })
      
      // Refresh the list
      fetchDeletedPolls()
      setRestoring(null)
      
      // Show success message
      alert(response.data.message + ' ' + response.data.forgiveness)
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore election. It prefers the void.')
      setRestoring(null)
    }
  }

  if (loading) {
    return (
      <div className="official-card">
        <div style={{textAlign: 'center', padding: '50px'}}>
          <i className="fas fa-spinner fa-spin" style={{fontSize: '3rem', color: '#1a3c6e'}}></i>
          <p style={{marginTop: '20px', color: '#6b7280'}}>
            Loading deleted elections...
          </p>
          <p style={{fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic'}}>
            (The ghosts of democracy are loading)
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="hall-of-shame-page">
      {/* Header */}
      <div className="official-card" style={{
        background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)',
        color: 'white',
        border: 'none'
      }}>
        <div style={{textAlign: 'center'}}>
          <i className="fas fa-ghost" style={{fontSize: '3rem', color: '#c9a84c'}}></i>
          <h2 style={{color: 'white', marginTop: '15px'}}>Hall of Shame</h2>
          <p style={{color: '#b8b8b8'}}>
            Where deleted elections go to be remembered (or mocked)
          </p>
          <p style={{color: '#8a8a8a', fontSize: '0.8rem', fontStyle: 'italic'}}>
            Every election here was silenced by the community. The people have spoken.
          </p>
        </div>
      </div>

      {/* Deleted Polls Grid */}
      {deletedPolls.length === 0 ? (
        <div className="official-card" style={{marginTop: '20px'}}>
          <div style={{textAlign: 'center', padding: '40px'}}>
            <i className="fas fa-smile" style={{fontSize: '3rem', color: '#4caf50'}}></i>
            <h3 style={{marginTop: '15px'}}>No Deleted Elections</h3>
            <p style={{color: '#6b7280'}}>
              Either democracy is thriving, or everyone is too lazy to delete things.
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {deletedPolls.map(poll => (
            <div key={poll.id} className="official-card" style={{
              background: '#f5f5f5',
              border: '2px solid #e0e0e0',
              opacity: '0.9'
            }}>
              <div style={{textAlign: 'center', marginBottom: '15px'}}>
                <i className="fas fa-skull" style={{fontSize: '2rem', color: '#8b1a1a'}}></i>
                <h3 style={{marginTop: '10px', textDecoration: 'line-through', color: '#666'}}>
                  {poll.title}
                </h3>
                {poll.description && (
                  <p style={{fontSize: '0.85rem', color: '#999', fontStyle: 'italic'}}>
                    "{poll.description}"
                  </p>
                )}
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                marginBottom: '15px',
                fontSize: '0.8rem',
                color: '#999'
              }}>
                <span>
                  <i className="fas fa-users"></i> {poll.candidate_count} candidates
                </span>
                <span>
                  <i className="fas fa-vote-yea"></i> {poll.vote_count} votes silenced
                </span>
                <span>
                  <i className="fas fa-user-times"></i> Deleted by {poll.deleted_by_name || 'Anonymous Coward'}
                </span>
              </div>
              
              <div style={{textAlign: 'center'}}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleRestore(poll.id)}
                  disabled={restoring === poll.id}
                >
                  {restoring === poll.id ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Restoring...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-undo"></i> Restore Election
                    </>
                  )}
                </button>
                <p style={{fontSize: '0.7rem', color: '#999', marginTop: '10px'}}>
                  Restore if you feel bad about silencing democracy
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guilt Message */}
      <div className="official-notice" style={{marginTop: '30px'}}>
        <p>
          <i className="fas fa-info-circle"></i>
          <strong> Note:</strong> Deleted elections can be restored by anyone who feels guilty 
          enough. Democracy is forgiving. The people forget quickly.
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

export default HallOfShamePage