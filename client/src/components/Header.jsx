import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="gov-header">
      <div className="gov-header-top">
        <div className="container">
          <span>An Official Website of the Department of Democracy</span>
          {isAuthenticated ? (
            <span>
              <i className="fas fa-user-check" style={{color: '#4caf50'}}></i> Signed in as <strong>{user.username}</strong>
            </span>
          ) : (
            <span>Secure Connection (Not Really)</span>
          )}
        </div>
      </div>
      
      <div className="gov-header-main">
        <div className="container">
          <div className="gov-logo">
            <div className="gov-logo-icon">
              <i className="fas fa-landmark"></i>
            </div>
            <div className="gov-title">
              <h1>Department of Democracy</h1>
              <p>Official Election Portal™</p>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="gov-nav">
        <div className="container">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            <i className="fas fa-home"></i> Home
          </Link>
          <Link to="/browse" className={location.pathname === '/browse' ? 'active' : ''}>
            <i className="fas fa-list"></i> Browse
          </Link>
          <Link to="/vote" className={location.pathname === '/vote' ? 'active' : ''}>
            <i className="fas fa-vote-yea"></i> Vote
          </Link>
          <Link to="/create" className={location.pathname === '/create' ? 'active' : ''}>
            <i className="fas fa-plus-circle"></i> Create
          </Link>
          <Link to="/results" className={location.pathname === '/results' ? 'active' : ''}>
            <i className="fas fa-chart-bar"></i> Results
          </Link>
          <Link to="/leaderboards" className={location.pathname === '/leaderboards' ? 'active' : ''}>
            <i className="fas fa-trophy"></i> Leaderboards
          </Link>
          <Link to="/hall-of-shame" className={location.pathname === '/hall-of-shame' ? 'active' : ''}>
            <i className="fas fa-ghost"></i> Hall of Shame
          </Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            <i className="fas fa-info-circle"></i> About
          </Link>
          
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                padding: '12px 20px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                borderBottom: '3px solid transparent',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderBottomColor = '#c9a84c'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderBottomColor = 'transparent'
              }}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          ) : (
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
              <i className="fas fa-sign-in-alt"></i> Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header