import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function ForgotPasswordPage() {
  const [username, setUsername] = useState('')
  const [revealedPassword, setRevealedPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError('')
    setRevealedPassword('')
    setIsLoading(true)
    
    setTimeout(async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/auth/forgot-password/${username}`)
        setRevealedPassword(response.data.password)
      } catch (err) {
        setError('User not found in our secure database.')
      } finally {
        setIsLoading(false)
      }
    }, 1500)
  }

  return (
    <div className="forgot-password-page">
      <div className="official-card" style={{maxWidth: '500px', margin: '0 auto'}}>
        <h2 style={{textAlign: 'center'}}>
          <i className="fas fa-key"></i> Password Recovery
        </h2>
        <p style={{textAlign: 'center', color: '#6b7280'}}>
          Our automated system will help you recover your password securely
        </p>
        
        <div className="official-notice">
          <p>
            <i className="fas fa-shield-alt"></i>
            <strong> Security Feature:</strong> For your protection, we use advanced password 
            recovery methods. <em>(We just look it up in our database.)</em>
          </p>
        </div>
        
        <form onSubmit={handleForgotPassword}>
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Verifying Identity...
              </>
            ) : (
              <>
                <i className="fas fa-search"></i> Recover Password
              </>
            )}
          </button>
        </form>
        
        {isLoading && (
          <div style={{textAlign: 'center', marginTop: '20px', color: '#6b7280'}}>
            <p>Accessing secure password database...</p>
            <p style={{fontSize: '0.85rem', fontStyle: 'italic'}}>
              (Opening passwords.txt)
            </p>
          </div>
        )}
        
        {revealedPassword && (
          <div className="official-notice" style={{marginTop: '20px', borderLeftColor: '#4caf50'}}>
            <p style={{textAlign: 'center'}}>
              <i className="fas fa-check-circle"></i> Identity Verified
            </p>
            <p style={{textAlign: 'center', fontSize: '1.1rem', marginTop: '10px'}}>
              Your password is:
            </p>
            <p style={{
              textAlign: 'center',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#1a3c6e',
              margin: '15px 0',
              fontFamily: 'monospace'
            }}>
              {revealedPassword}
            </p>
            <p style={{textAlign: 'center', fontSize: '0.85rem', fontStyle: 'italic'}}>
              For security purposes, please memorize this password and never share it with anyone.
              <em> (Too late. We already saw it.)</em>
            </p>
          </div>
        )}
        
        {error && (
          <div className="official-notice warning" style={{marginTop: '20px'}}>
            <p><i className="fas fa-exclamation-circle"></i> {error}</p>
          </div>
        )}
        
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <Link to="/login" style={{color: '#1a3c6e', textDecoration: 'none', marginRight: '15px'}}>
            <i className="fas fa-arrow-left"></i> Back to Login
          </Link>
          <Link to="/register" style={{color: '#1a3c6e', textDecoration: 'none'}}>
            <i className="fas fa-user-plus"></i> Register Instead
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage