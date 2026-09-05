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
    
    // Simulate "looking for password" delay
    setTimeout(async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/auth/forgot-password/${username}`)
        setRevealedPassword(response.data.password)
      } catch (err) {
        setError('User not found. Are you sure you exist?')
      } finally {
        setIsLoading(false)
      }
    }, 2000)
  }

  return (
    <div className="forgot-password-page">
      <header className="gov-header">
        <h1>🔍 Password Recovery</h1>
        <p style={{textAlign: 'center', color: '#ffd700', marginTop: '10px'}}>
          We never forget (because we store it in plain text)
        </p>
      </header>

      <div className="glass-panel" style={{maxWidth: '500px', margin: '0 auto'}}>
        <h2 style={{color: 'white', textAlign: 'center', marginBottom: '20px'}}>
          Forgot Your Password?
        </h2>
        
        <p style={{color: 'white', textAlign: 'center', marginBottom: '20px'}}>
          Don't worry, we have it right here. Just tell us who you are.
        </p>
        
        <form onSubmit={handleForgotPassword}>
          <div style={{marginBottom: '20px'}}>
            <label style={{color: 'white', display: 'block', marginBottom: '5px'}}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.9)',
                fontSize: '16px'
              }}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={isLoading}>
            {isLoading ? '🔍 Searching our database...' : 'Find My Password'}
          </button>
        </form>
        
        {isLoading && (
          <div style={{textAlign: 'center', marginTop: '20px', color: 'white'}}>
            <p>Searching through our extremely secure database...</p>
            <p style={{fontSize: '0.8em', color: '#ffd700'}}>
              (It's in a file called users.txt)
            </p>
          </div>
        )}
        
        {revealedPassword && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            background: 'rgba(126,200,80,0.3)',
            borderRadius: '10px',
            color: 'white',
            textAlign: 'center'
          }}>
            <p style={{fontSize: '1.2em', marginBottom: '10px'}}>
              🎉 We found it!
            </p>
            <p>Your password is:</p>
            <p style={{
              fontSize: '2em',
              fontWeight: 'bold',
              color: '#ffd700',
              margin: '10px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              {revealedPassword}
            </p>
            <p style={{fontSize: '0.9em', marginTop: '10px'}}>
              Yes, we just displayed it publicly. That's how much we care about security.
            </p>
          </div>
        )}
        
        {error && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(178,34,52,0.3)',
            borderRadius: '10px',
            color: 'white'
          }}>
            {error}
          </div>
        )}
        
        <div style={{textAlign: 'center', marginTop: '20px', color: 'white'}}>
          <Link to="/login" style={{color: '#ffd700', marginRight: '10px'}}>
            Back to Login
          </Link>
          <Link to="/register" style={{color: '#ffd700'}}>
            Register Instead
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage