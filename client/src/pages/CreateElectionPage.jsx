import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function CreateElectionPage() {
  const { user, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '24h',
    allowDuplicates: true,
    allowUndo: true,
    showLiveResults: true,
    securityLevel: 'none',
    candidates: [
      { name: '', platform: '' },
      { name: '', platform: '' }
    ]
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [createdPollId, setCreatedPollId] = useState(null)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = [...formData.candidates]
    updatedCandidates[index][field] = value
    setFormData(prev => ({
      ...prev,
      candidates: updatedCandidates
    }))
  }

  const addCandidate = () => {
    setFormData(prev => ({
      ...prev,
      candidates: [...prev.candidates, { name: '', platform: '' }]
    }))
  }

  const removeCandidate = (index) => {
    if (formData.candidates.length <= 2) {
      setError('An election requires at least 2 candidates. (The Pigeon doesn\'t count.)')
      return
    }
    const updatedCandidates = formData.candidates.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      candidates: updatedCandidates
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setCreatedPollId(null)
    
    // Basic validation
    if (!formData.title.trim()) {
      setError('Please enter an election title.')
      return
    }
    
    const validCandidates = formData.candidates.filter(c => c.name.trim())
    if (validCandidates.length < 2) {
      setError('Please enter at least 2 candidates. (The Pigeon will be added automatically.)')
      return
    }
    
    try {
      const response = await axios.post('http://localhost:3001/api/polls/create', {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        allowDuplicates: formData.allowDuplicates,
        allowUndo: formData.allowUndo,
        showLiveResults: formData.showLiveResults,
        securityLevel: formData.securityLevel,
        candidates: validCandidates,
        creatorId: user?.id || null  // <-- Use context
      })
      
      setCreatedPollId(response.data.poll.id)
      setMessage('Election created successfully! Redirecting to your election...')
      
      setTimeout(() => {
        navigate(`/poll/${response.data.poll.id}`)
      }, 2000)
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create election. Brian strikes again.')
    }
  }

  return (
    <div className="create-election-page">
      {!isAuthenticated && (
        <div className="official-notice warning" style={{marginBottom: '20px'}}>
          <p>
            <i className="fas fa-exclamation-triangle"></i>
            <strong> Not Signed In:</strong> Your election will be created anonymously 
            and won't count toward your "Puppet Master" achievement.
            <Link to="/login" style={{marginLeft: '10px', fontWeight: 'bold'}}>
              Login to create officially →
            </Link>
          </p>
        </div>
      )}
      
      {isAuthenticated && (
        <div className="official-notice" style={{marginBottom: '20px', borderLeftColor: '#4caf50'}}>
          <p>
            <i className="fas fa-check-circle" style={{color: '#4caf50'}}></i>
            <strong> Creating as {user.username}.</strong> This election will count toward your achievements.
          </p>
        </div>
      )}
      <div className="official-card">
        <h2>
          <i className="fas fa-plus-circle"></i> Create Official Election
        </h2>
        <p>Use this form to create a new democratic election for any purpose.</p>
        
        <div className="official-notice">
          <p>
            <i className="fas fa-shield-alt"></i>
            <strong> System Notice:</strong> All elections are monitored for integrity and 
            security by our automated systems. <em>(Monitored by Brian, who is currently napping.)</em>
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Election Details */}
          <h3 style={{marginTop: '30px', marginBottom: '20px'}}>Election Details</h3>
          
          <div className="form-group">
            <label htmlFor="title">
              <i className="fas fa-heading"></i> Election Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., What should we name the office plant?"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">
              <i className="fas fa-align-left"></i> Election Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide context for voters..."
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="duration">
              <i className="fas fa-clock"></i> Election Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
            >
              <option value="1h">1 hour</option>
              <option value="24h">24 hours</option>
              <option value="7d">1 week</option>
              <option value="forever">Until Brian unplugs it</option>
              <option value="retroactive">End 3 hours ago (retroactive)</option>
            </select>
          </div>
          
          {/* Candidates */}
          <h3 style={{marginTop: '30px', marginBottom: '20px'}}>Candidates</h3>
          
          {formData.candidates.map((candidate, index) => (
            <div key={index} style={{
              background: '#f5f7fa',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '15px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                display: 'flex',
                gap: '10px'
              }}>
                <span style={{
                  background: '#1a3c6e',
                  color: 'white',
                  padding: '2px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem'
                }}>
                  Candidate {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeCandidate(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8b1a1a',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="form-group" style={{marginTop: '10px'}}>
                <label>
                  <i className="fas fa-user"></i> Candidate Name
                </label>
                <input
                  type="text"
                  value={candidate.name}
                  onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                  placeholder="Enter candidate name"
                />
              </div>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-bullhorn"></i> Platform/Description
                </label>
                <input
                  type="text"
                  value={candidate.platform}
                  onChange={(e) => handleCandidateChange(index, 'platform', e.target.value)}
                  placeholder="What does this candidate stand for?"
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addCandidate}
            style={{width: '100%', marginBottom: '20px'}}
          >
            <i className="fas fa-plus"></i> Add Candidate
          </button>
          
          {/* Election Settings */}
          <h3 style={{marginTop: '30px', marginBottom: '20px'}}>Election Settings</h3>
          
          <div className="form-group">
            <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <input
                type="checkbox"
                name="allowDuplicates"
                checked={formData.allowDuplicates}
                onChange={handleInputChange}
              />
              Allow Duplicate Voting
            </label>
            <div className="hint">
              Voters may cast multiple votes. <em>(This is called "enthusiasm" in democratic terms.)</em>
            </div>
          </div>
          
          <div className="form-group">
            <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <input
                type="checkbox"
                name="allowUndo"
                checked={formData.allowUndo}
                onChange={handleInputChange}
              />
              Allow Vote Changes
            </label>
            <div className="hint">
              Voters can change their minds. <em>(Democracy with buyer's remorse.)</em>
            </div>
          </div>
          
          <div className="form-group">
            <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <input
                type="checkbox"
                name="showLiveResults"
                checked={formData.showLiveResults}
                onChange={handleInputChange}
              />
              Show Live Results
            </label>
            <div className="hint">
              Display real-time results to voters. <em>(Influencing voter behavior is a feature.)</em>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="securityLevel">
              <i className="fas fa-shield-alt"></i> Security Level
            </label>
            <select
              id="securityLevel"
              name="securityLevel"
              value={formData.securityLevel}
              onChange={handleInputChange}
            >
              <option value="none">None</option>
              <option value="very-none">Very None</option>
              <option value="blockchain">Blockchain™</option>
              <option value="password">Password: "password"</option>
            </select>
            <div className="hint-warning">
              All security levels provide equal protection. <em>(Zero.)</em>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '20px'}}>
            <i className="fas fa-rocket"></i> Launch Election
          </button>
        </form>
        
        {message && (
          <div className="official-notice" style={{
            marginTop: '20px',
            borderLeftColor: message.includes('successfully') ? '#4caf50' : '#c9a84c'
          }}>
            <p>
              <i className="fas fa-info-circle"></i> {message}
              {createdPollId && (
                <Link to={`/poll/${createdPollId}`} style={{marginLeft: '10px'}}>
                  Go to Election →
                </Link>
              )}
            </p>
          </div>
        )}
        
        {error && (
          <div className="official-notice warning" style={{marginTop: '20px'}}>
            <p><i className="fas fa-exclamation-circle"></i> {error}</p>
          </div>
        )}
      </div>
      
      {/* The Pigeon Notice */}
      <div className="official-notice" style={{marginTop: '20px'}}>
        <p>
          <i className="fas fa-dove"></i>
          <strong> Note:</strong> The Pigeon will be automatically added as a candidate to 
          every election. The Pigeon cannot be removed. The Pigeon is eternal.
        </p>
      </div>
    </div>
  )
}

export default CreateElectionPage