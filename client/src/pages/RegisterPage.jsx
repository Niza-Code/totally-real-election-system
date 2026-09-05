import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        username,
        password,
        email
      })
      
      setMessage(response.data.message + ' (Your password is stored in plain text, we can see it!)')
      
      // Auto-redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Oh... Anyway.')
    }
  }

  return (
    <div className="register-page">
      <header className="gov-header">
        <h1>📝 Voter Registration</h1>
        <p style={{textAlign: 'center', color: '#ffd700', marginTop: '10px'}}>
          Because democracy needs more voters (literally anyone)
        </p>
      </header>

      <div className="glass-panel" style={{maxWidth: '500px', margin: '0 auto'}}>
        <h2 style={{color: 'white', textAlign: 'center', marginBottom: '20px'}}>
          Register to Vote™
        </h2>
        
        <form onSubmit={handleRegister}>
          <div style={{marginBottom: '15px'}}>
            <label style={{color: 'white', display: 'block', marginBottom: '5px'}}>
              Username*
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="John (or whatever)"
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
          
          <div style={{marginBottom: '15px'}}>
            <label style={{color: 'white', display: 'block', marginBottom: '5px'}}>
              Password* <span style={{fontSize: '0.8em', color: '#ffd700'}}>(stored in plain text)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Use 'password' like everyone else"
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
              Email (optional, we won't use it)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="not_provided@nobody.com"
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
            Register (Maybe)
          </button>
        </form>
        
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
          Already registered? <Link to="/login" style={{color: '#ffd700'}}>Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage