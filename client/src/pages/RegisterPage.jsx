import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    dateOfBirth: '',
    address: '',
    agreeToTerms: false
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    
    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service (even though nobody reads them)')
      return
    }
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        username: formData.username,
        password: formData.password,
        email: formData.email
      })
      
      setMessage('Registration successful! Logging you in...')
      
      // Auto-login after registration
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        username: formData.username,
        password: formData.password
      })
      
      login(loginResponse.data.user, loginResponse.data.token)
      
      setTimeout(() => {
        navigate('/')
      }, 1500)
      
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="register-page">
      <div className="official-card">
        <h2>
          <i className="fas fa-user-plus"></i> Voter Registration
        </h2>
        <p>Complete the form below to register as an official voter in the Department of Democracy's election system.</p>
        
        <div className="official-notice">
          <p>
            <i className="fas fa-shield-alt"></i>
            <strong> Security Notice:</strong> Your information is protected by our advanced encryption 
            protocols. <em>(Not actually encrypted. We just wanted you to feel safe.)</em>
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter a unique username"
              required
            />
            <div className="hint">This will be your public identity in the democratic process</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a strong password"
              required
            />
            <div className="hint-warning">
              Note: Passwords are stored securely for your protection. 
              <em> (In a plain text file called passwords.txt)</em>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
            <div className="hint">We'll only use this for important election updates (and spam, probably)</div>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                style={{marginRight: '10px'}}
              />
              I agree to the Terms of Service and Privacy Policy
            </label>
            <div className="hint">
              By checking this box, you agree to let us store your password in plain text, 
              share your data with third parties, and occasionally blame Brian for system failures.
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
            <i className="fas fa-check-circle"></i> Complete Registration
          </button>
        </form>
        
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
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage