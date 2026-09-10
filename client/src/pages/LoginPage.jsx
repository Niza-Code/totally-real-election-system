import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        username,
        password
      })
      
      // Use context login instead of manual localStorage
      login(response.data.user, response.data.token)
      
      setMessage('Authentication successful. Welcome back, citizen.')
      
      setTimeout(() => {
        navigate('/')
      }, 1500)
      
    } catch (err) {
      setError('Invalid credentials. Please check your username and password.')
    }
  }

  return (
    <div className="login-page">
      <div className="official-card" style={{maxWidth: '500px', margin: '0 auto'}}>
        <h2 style={{textAlign: 'center'}}>
          <i className="fas fa-sign-in-alt"></i> Voter Authentication
        </h2>
        <p style={{textAlign: 'center', color: '#6b7280'}}>
          Please enter your credentials to access the election system
        </p>
        
        <form onSubmit={handleLogin}>
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
          
          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
            <i className="fas fa-shield-alt"></i> Secure Login
          </button>
        </form>
        
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <Link to="/forgot-password" style={{color: '#1a3c6e', textDecoration: 'none'}}>
            <i className="fas fa-key"></i> Forgot Password?
          </Link>
        </div>
        
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
        
        <p style={{textAlign: 'center', marginTop: '20px'}}>
          Not registered? <Link to="/register">Create an account</Link>
        </p>
        
        <div className="official-notice" style={{marginTop: '20px'}}>
          <p style={{fontSize: '0.85rem'}}>
            <i className="fas fa-info-circle"></i>
            <em> For your security, this session is encrypted with military-grade protocols.</em>
            <em style={{fontSize: '0.75rem', display: 'block', marginTop: '5px'}}>
              (Not really. Your password is stored in plain text and anyone can see it.)
            </em>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage