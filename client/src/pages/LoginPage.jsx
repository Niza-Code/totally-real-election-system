import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        username,
        password
      })
      
      // Store the "token" (base64 encoded, totally not secure)
      localStorage.setItem('fakeToken', response.data.token)
      localStorage.setItem('userData', JSON.stringify(response.data.user))
      
      setMessage(response.data.message + ' Redirecting to democracy...')
      
      setTimeout(() => {
        navigate('/')
      }, 2000)
      
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Did you try "password"?')
    }
  }

  return (
    <div className="login-page">
      <header className="gov-header">
        <h1>🔑 Voter Login</h1>
        <p style={{textAlign: 'center', color: '#ffd700', marginTop: '10px'}}>
          Welcome back to democracy (we think)
        </p>
      </header>

      <div className="glass-panel" style={{maxWidth: '500px', margin: '0 auto'}}>
        <h2 style={{color: 'white', textAlign: 'center', marginBottom: '20px'}}>
          Enter Your Credentials™
        </h2>
        
        <form onSubmit={handleLogin}>
          <div style={{marginBottom: '15px'}}>
            <label style={{color: 'white', display: 'block', marginBottom: '5px'}}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="John (or whatever you registered as)"
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
          
          <div style={{marginBottom: '20px'}}>
            <label style={{color: 'white', display: 'block', marginBottom: '5px'}}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your plain text password"
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
          
          <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
            Login (Securely*)
          </button>
        </form>
        
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <Link to="/forgot-password" style={{color: '#ffd700'}}>
            Forgot Password? (We didn't)
          </Link>
        </div>
        
        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(126,200,80,0.3)',
            borderRadius: '10px',
            color: 'white'
          }}>
            {message}
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
        
        <p style={{textAlign: 'center', marginTop: '20px', color: 'white'}}>
          Not registered? <Link to="/register" style={{color: '#ffd700'}}>Register here</Link>
        </p>
        
        <p style={{textAlign: 'center', marginTop: '10px', fontSize: '0.8em', color: '#ffd700'}}>
          *Not actually secure. Your password is stored in plain text.
        </p>
      </div>
    </div>
  )
}

export default LoginPage